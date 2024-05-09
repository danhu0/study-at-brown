package edu.brown.cs.student.main.server.storage;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

public class MockedUtilities implements StorageInterface {

    //{mock-user: {saved-spots: {spot-0: {id: 0}}, {spot-1: {id: 1}}}, user-2:{ etc...}
    private final Map<String, Map<String, Map<String, Map<String, Object>>>> userData;

    public MockedUtilities() {
        this.userData = new HashMap<>();
        this.userData.put("mock-user", new HashMap<>());
        this.userData.get("mock-user").put("saved-spots", new HashMap<>());
    }

    /**
     * @param uid
     * @param collection_id
     * @param doc_id
     * @param data
     */
    @Override
    public void addDocument(String uid, String collection_id, String doc_id, Map<String, Object> data) {
//        this.storageHandler.addDocument(uid, "saved-spots", loungeID, data);
        this.userData.get(uid).get(collection_id).put(doc_id, data);
    }

    /**
     * @param uid
     * @param collection_id
     * @return
     * @throws InterruptedException
     * @throws ExecutionException
     */
    @Override
    public List<Map<String, Object>> getCollection(String uid, String collection_id) throws InterruptedException, ExecutionException {
        List<Map<String, Object>> data = new ArrayList<>();
        for(Map m : this.userData.get(uid).get(collection_id).values()) {
            data.add(m);
        }
        return data;

    }

    /**
     * @param uid
     * @throws InterruptedException
     * @throws ExecutionException
     */
    @Override
    public void clearUser(String uid) throws InterruptedException, ExecutionException {
        this.userData.get(uid).get("saved-spots").clear();
    }
}
