package com.taha.backendservice.repository.impl;

import com.mongodb.ReadConcern;
import com.mongodb.ReadPreference;
import com.mongodb.TransactionOptions;
import com.mongodb.WriteConcern;
import com.mongodb.client.ClientSession;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.FindOneAndReplaceOptions;
import com.mongodb.client.model.ReplaceOneModel;
import com.taha.backendservice.model.db.Position;
import com.taha.backendservice.model.db.User;
import com.taha.backendservice.repository.UserRepository;
import org.bson.BsonDocument;
import org.bson.types.ObjectId;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.in;
import static com.mongodb.client.model.ReturnDocument.AFTER;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class UserRepositoryImpl implements UserRepository {

    private static final TransactionOptions txnOptions = TransactionOptions.builder()
                                                                           .readPreference(ReadPreference.primary())
                                                                           .readConcern(ReadConcern.MAJORITY)
                                                                           .writeConcern(WriteConcern.MAJORITY)
                                                                           .build();
    private final MongoClient client;
    private MongoCollection<User> userCollection;
    public UserRepositoryImpl(MongoClient client) {
        this.client = client;
    }

    @PostConstruct
    void init() {
        userCollection = client.getDatabase("mocket").getCollection("users", User.class);
    }

    @Override
    public User save(User user) {
        user.setId(new ObjectId());
        userCollection.insertOne(user);
        return user;
    }

    @Override
    public List<User> saveAll(List<User> users) {
        try(ClientSession clientSession = client.startSession()) {
            return clientSession.withTransaction(() -> {
                users.forEach(p -> p.setId(new ObjectId()));
                userCollection.insertMany(clientSession, users);
                return users;
            }, txnOptions);
        }
    }

    @Override
    public User find(String id) {
        return userCollection.find(eq("_id", new ObjectId(id))).first();
    }

    @Override
    public List<User> findAll(List<String> ids) {
        return userCollection.find(in("_id", mapToObjectIds(ids))).into(new ArrayList<>());
    }

    @Override
    public List<User> findAll() {
        return userCollection.find().into(new ArrayList<>());
    }

    @Override
    public long count() {
        return userCollection.countDocuments();
    }

    @Override
    public long delete(String id) {
        return userCollection.deleteOne(eq("_id", new ObjectId(id))).getDeletedCount();
    }

    @Override
    public long deleteAll(List<String> ids) {
        try(ClientSession clientSession = client.startSession()) {
            return clientSession.withTransaction(() -> userCollection.deleteMany(clientSession,
                   in("_id", mapToObjectIds(ids))).getDeletedCount(), txnOptions);
        }
    }

    @Override
    public long deleteAll() {
        try (ClientSession clientSession = client.startSession()) {
            return clientSession.withTransaction(() ->
                   userCollection.deleteMany(clientSession, new BsonDocument()).getDeletedCount(), txnOptions);
        }
    }

    @Override
    public User update(User user) {
        FindOneAndReplaceOptions options = new FindOneAndReplaceOptions().returnDocument(AFTER);
        return userCollection.findOneAndReplace(eq("_id", user.getId()), user, options);
    }

    @Override
    public long update(List<User> users) {
        List<ReplaceOneModel<User>> writes = users.stream()
                .map(p -> new ReplaceOneModel<>(eq("_id", p.getId()), p))
                .toList();
        try (ClientSession clientSession = client.startSession()) {
            return clientSession.withTransaction(
                   () -> userCollection.bulkWrite(clientSession, writes).getModifiedCount(), txnOptions);
        }
    }

    @Override
    public User addPosition(String id, Position p) {
        User u = find(id);
        u.addPosition(p);
        return update(u);
    }

    @Override
    public User closePosition(String userId, String symbol, int quantity, double price) {
        User u = find(userId);
        u.closePosition(symbol, quantity, price);
        return update(u);
    }

    @Override
    public List<Position> getSymPositions(String id, String symbol) {
        User u = find(id);
        return u.getSymPositions(symbol);
    }

    private List<ObjectId> mapToObjectIds(List<String> ids) {
        return ids.stream().map(ObjectId::new).toList();
    }
}
