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
import com.taha.backendservice.exception.TradeException;
import com.taha.backendservice.model.TwelveDataRequest;
import com.taha.backendservice.model.db.Position;
import com.taha.backendservice.model.db.User;
import com.taha.backendservice.model.price.GraphData;
import com.taha.backendservice.model.price.OrderData;
import com.taha.backendservice.model.price.PriceData;
import com.taha.backendservice.model.price.TimeIntervalResponse;
import com.taha.backendservice.model.quote.QuoteResponse;
import com.taha.backendservice.repository.UserRepository;
import com.taha.backendservice.service.TradeService;
import org.bson.BsonDocument;
import org.bson.types.ObjectId;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.in;
import static com.mongodb.client.model.ReturnDocument.AFTER;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Repository
public class UserRepositoryImpl implements UserRepository {

    private static final TransactionOptions txnOptions = TransactionOptions.builder()
                                                                           .readPreference(ReadPreference.primary())
                                                                           .readConcern(ReadConcern.MAJORITY)
                                                                           .writeConcern(WriteConcern.MAJORITY)
                                                                           .build();
    private final MongoClient client;
    private MongoCollection<User> userCollection;
    private TradeService tradeService;
    @Value("${mocket.login.lock.duration}")
    private long duration;
    public UserRepositoryImpl(MongoClient client, TradeService tradeService) {
        this.client = client;
        this.tradeService = tradeService;
    }

    @PostConstruct
    void init() {
        userCollection = client.getDatabase("mocket").getCollection("users", User.class);
    }

    @Override
    public User save(User user) {
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
    public Optional<User> findById(String id) {
        return Optional.of(userCollection.find(eq("_id", new ObjectId(id))).first());
    }

    @Override
    public Boolean existsById(String id) {
        if(userCollection.find(eq("_id", new ObjectId(id))).first() != null) {
            return true;
        }
        else {
            return false;
        }
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return Optional.of(userCollection.find(eq("email", email)).first());
    }

    @Override
    public Boolean existsByEmail(String email) {
        if(userCollection.find(eq("email", email)).first() != null) {
            return true;
        }
        else {
            return false;
        }
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
    public User verifyUser(String id) {
        User u = find(id);
        u.setVerified(true);
        return update(u);
    }

    @Override
    public User changePassword(String id, String newPassword) {
        User u = find(id);
        u.setPassword(newPassword);
        return update(u);
    }

    @Override
    public User incrementLoginFails(String email) {
        User u = findByEmail(email).get();
        if(u.isLocked()) {
            u.setLockTime(new Date());
        }
        else if(u.getFailedLoginAttempts() == 5)  {
            u.setLocked(true);
            u.setLockTime(new Date());
        }
        else {
            u.setFailedLoginAttempts(u.getFailedLoginAttempts() + 1);
        }
        return update(u);
    }

    @Override
    public int checkUserStatus(String email) {
        if(existsByEmail(email)) {
            User u = findByEmail(email).get();
            if(u.getPassword() == null) {
                return 2;
            }
            if(u.isLocked()) {
                long lockTime = u.getLockTime().getTime();
                long currTime = System.currentTimeMillis();
                if(currTime - lockTime >= duration) {
                    u.setLocked(false);
                    u.setFailedLoginAttempts(0);
                    u.setLockTime(null);
                    update(u);
                    return 1;
                }
                else {
                    return 0;
                }
            }
            else {
                return 1;
            }
        }
        else {
            return -1;
        }
    }

    @Override
    public User clearLoginFails(String id) {
        User u = find(id);
        u.setFailedLoginAttempts(0);
        return update(u);
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
    public User updatePosition(String userId, String posId, Position p) {
        User u = find(userId);
        u.updatePosition(posId, p);
        return update(u);
    }

    @Override
    public List<Position> getSymPositions(String id, String symbol) {
        User u = find(id);
        return u.getSymPositions(symbol);
    }

    @Override
    public List<QuoteResponse> getPosQuotes(String id) throws TradeException {
        User u = find(id);
        List<Position> positions = u.getPositions();
        ArrayList<QuoteResponse> result = new ArrayList<>();
        ArrayList<String> fetched = new ArrayList<>();
        for(Position p : positions) {
            if(p.isOpen()) {
                String symbol = p.getSymbol();
                if(!fetched.contains(symbol)) {
                    TwelveDataRequest request = new TwelveDataRequest(symbol);
                    result.add(tradeService.getQuoteData(request));
                }
                fetched.add(symbol);
            }
        }
        return result;
    }

    @Override
    public List<GraphData> getGraphData(String id, String interval, String start_date) throws TradeException {
        User u = find(id);
        List<Position> positions = u.getPositions();
        Map<String, TimeIntervalResponse> priceData = new HashMap<>();
        ArrayList<String> fetched = new ArrayList<>();
        SimpleDateFormat sdf;
        if(interval.equals("1day")) {
            sdf = new SimpleDateFormat("yyyy-MM-dd");
        }
        else {
            sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        }

        for(Position p : positions) {
            String symbol = p.getSymbol();
            if(!fetched.contains(symbol)) {
                TwelveDataRequest request = new TwelveDataRequest(symbol, interval, start_date, "ASC");
                priceData.put(symbol, tradeService.getPriceData(request));
                fetched.add(symbol);
            }
        }
        ArrayList<GraphData> result = new ArrayList<>();
        Map<String, Double> resMap = new TreeMap<>();
        for(Position p : positions) {
            TimeIntervalResponse timeseries = priceData.get(p.getSymbol());
            if(timeseries.getValues() == null) {
                continue;
            }
            Date opendt;
            Date closedt = null;
            try {
                opendt = sdf.parse(p.getOpenTimestamp());
                if(p.getCloseTimestamp() != null) {
                    closedt = sdf.parse(p.getCloseTimestamp());
                }
            }
            catch (ParseException e){
                e.printStackTrace();
                continue;
            }
            for(PriceData pd : timeseries.getValues()) {
                Date datadt;
                String datetime = pd.getDatetime();
                double total = 0.0;
                try {
                    datadt = sdf.parse(datetime);
                }
                catch (ParseException e){
                    e.printStackTrace();
                    continue;
                }
                if(datadt.before(opendt)) {
                    if(p.isOpen()) {
                        total += p.getQuantity() * p.getBuy();
                    }
                }
                else if((datadt.equals(opendt) || datadt.after(opendt)) && (closedt == null || datadt.before(closedt))) {
                    if (p.isOpen()) {
                        total += p.getQuantity() * Double.parseDouble(pd.getClose());
                    } else {
                        total += p.getQuantity() * (Double.parseDouble(pd.getClose()) - p.getSell());
                    }
                }
                resMap.put(datetime, resMap.getOrDefault(datetime, 0.0) + total);
            }
        }
        Set<Map.Entry<String, Double>> entries = resMap.entrySet();
        Map.Entry<String, Double>[] entriesArr = entries.toArray(new Map.Entry[entries.size()]);
        for(int i = 0; i < entriesArr.length; i++) {
            GraphData g = new GraphData(entriesArr[i].getKey(), entriesArr[i].getValue() + u.getBalance());
            result.add(g);
        }
        return result;
    }

    @Override
    public List<OrderData> getOrderHist(String id) {
        User u = find(id);
        List<OrderData> result = new ArrayList<>();
        List<Position> positions = u.getPositions();
        for(Position p : positions) {
            OrderData temp = new OrderData(p.getSymbol(), p.getOpenTimestamp(), p.getBuy(), p.getQuantity());
            result.add(temp);
            if(!p.isOpen()) {
                temp = new OrderData(p.getSymbol(), p.getCloseTimestamp(), p.getBuy(), p.getSell(), p.getQuantity());
                result.add(temp);
            }
        }
        Collections.sort(result, (o1, o2) -> o2.getTimestamp().compareTo(o1.getTimestamp()));
        return result;
    }

    private List<ObjectId> mapToObjectIds(List<String> ids) {
        return ids.stream().map(ObjectId::new).toList();
    }
}
