package com.taha.backendservice.repository.impl;

import com.mongodb.ReadConcern;
import com.mongodb.ReadPreference;
import com.mongodb.TransactionOptions;
import com.mongodb.WriteConcern;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.taha.backendservice.constants.ERole;
import com.taha.backendservice.model.db.Role;
import com.taha.backendservice.repository.RoleRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import static com.mongodb.client.model.Filters.eq;

@Repository
public class RoleRepositoryImpl implements RoleRepository {
    private static final TransactionOptions txnOptions = TransactionOptions.builder()
            .readPreference(ReadPreference.primary())
            .readConcern(ReadConcern.MAJORITY)
            .writeConcern(WriteConcern.MAJORITY)
            .build();
    private final MongoClient client;
    private MongoCollection<Role> roleCollection;

    @PostConstruct
    void init() {
        roleCollection = client.getDatabase("mocket").getCollection("roles", Role.class);
    }

    public RoleRepositoryImpl(MongoClient client) {
        this.client = client;
    }
    @Override
    public Optional<Role> findByType(ERole type) {
        return Optional.of(roleCollection.find(eq("type", type)).first());
    }
}
