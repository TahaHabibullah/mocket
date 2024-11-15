package com.taha.backendservice.repository.impl;

import com.mongodb.ReadConcern;
import com.mongodb.ReadPreference;
import com.mongodb.TransactionOptions;
import com.mongodb.WriteConcern;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.taha.backendservice.model.db.User;
import com.taha.backendservice.model.db.Verification;
import com.taha.backendservice.repository.UserRepository;
import com.taha.backendservice.repository.VerificationRepository;
import com.taha.backendservice.service.EmailVerificationService;
import jakarta.annotation.PostConstruct;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Calendar;
import java.util.Date;
import java.util.UUID;

import static com.mongodb.client.model.Filters.eq;

@Repository
public class VerificationRepositoryImpl implements VerificationRepository {
    private static final TransactionOptions txnOptions = TransactionOptions.builder()
            .readPreference(ReadPreference.primary())
            .readConcern(ReadConcern.MAJORITY)
            .writeConcern(WriteConcern.MAJORITY)
            .build();
    private final MongoClient client;
    private MongoCollection<Verification> verificationCollection;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmailVerificationService emailVerificationService;
    public VerificationRepositoryImpl(MongoClient client) { this.client = client; }

    @PostConstruct
    void init() {
        verificationCollection = client.getDatabase("mocket").getCollection("verification", Verification.class);
    }

    @Override
    public int initVerification(User user) {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.HOUR, 24);
        String token = UUID.randomUUID().toString();

        try {
            verificationCollection.insertOne(
                    new Verification(new ObjectId(),
                            token,
                            user.getId().toString(),
                            calendar.getTime()
                    )
            );
            emailVerificationService.sendVerification(user.getEmail(), token);
            return 1;
        } catch (Exception e) {
            return -1;
        }
    }

    @Override
    public void completeVerification(String token) {
        Verification verification = verificationCollection.find(eq("token", token)).first();
        userRepository.verifyUser(verification.getUserId());
        verificationCollection.deleteOne(eq("_id", verification.getId()));
    }

    @Override
    public int initForgotPassword(User user) {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.HOUR, 24);
        String token = UUID.randomUUID().toString();

        try {
            verificationCollection.insertOne(
                    new Verification(new ObjectId(),
                            token,
                            user.getId().toString(),
                            calendar.getTime()
                    )
            );
            emailVerificationService.sendForgotPass(user.getEmail(), token);
            return 1;
        } catch (Exception e) {
            return -1;
        }
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        Verification verification = verificationCollection.find(eq("token", token)).first();
        userRepository.changePassword(verification.getUserId(), newPassword);
        verificationCollection.deleteOne(eq("_id", verification.getId()));
    }

    @Override
    public int checkToken(String token) {
        try {
            FindIterable<Verification> result = verificationCollection.find(eq("token", token));
            if(!result.iterator().hasNext()) {
                return 0;
            }

            Verification verification = result.first();
            if(verification.getExpiration().before(new Date())) {
                verificationCollection.deleteOne(eq("_id", verification.getId()));
                return 2;
            }
            else {
                return 1;
            }
        } catch (Exception e) {
            return -1;
        }
    }
}
