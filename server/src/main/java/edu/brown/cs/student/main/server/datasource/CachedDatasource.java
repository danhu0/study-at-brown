package edu.brown.cs.student.main.server.datasource;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.CacheStats;
import com.google.common.cache.LoadingCache;
import edu.brown.cs.student.main.server.CoordBounds;
import java.util.HashMap;
import java.util.concurrent.TimeUnit;

/**
 * Class which wraps the Datasource to store each of its outputs into a cache. Instantiate by
 * passing in a Datasource OR passing in a Datasource, the max size of the cache, and the number of
 * minutes the cache is meant to wait for each entry before clearing the entry.
 */
public class CachedDatasource implements Datasource {

  private final LoadingCache<HashMap<CoordBounds, Double>, String> cache;
  private final Datasource datasource;

  /**
   * Default constructor of CachedDatasource, takes in a Datasource and wraps it.
   *
   * @param datasource - the DataSource to wrap
   */
  public CachedDatasource(Datasource datasource) {
    this.datasource = datasource;

    this.cache =
        CacheBuilder.newBuilder()
            .maximumSize(50)
            .expireAfterWrite(20, TimeUnit.MINUTES)
            .recordStats()
            .build(
                new CacheLoader<>() {
                  @Override
                  public String load(HashMap<CoordBounds, Double> params) throws Exception {
                    return datasource.sendRequest(params);
                  }
                });
  }

  /**
   * Overloaded constructor for the CachedDatasource, includes extra parameters to specify the
   * cache's size and how long it should wait before clearing contents.
   *
   * @param datasource - the DataSource to wrap
   * @param maxSize - the maximum size of the cache
   * @param minToExpel - time after an element is added after which to clear it from the cache
   */
  public CachedDatasource(final Datasource datasource, int maxSize, int minToExpel) {
    this.datasource = datasource;
    this.cache =
        CacheBuilder.newBuilder()
            .maximumSize(maxSize)
            .expireAfterWrite(minToExpel, TimeUnit.MINUTES)
            .recordStats()
            .build(
                new CacheLoader<>() {
                  @Override
                  public String load(HashMap<CoordBounds, Double> params) throws Exception {
                    return datasource.sendRequest(params);
                  }
                });
  }

  /**
   * Testing method that provides detailed cache stats information to test that the cache is working
   * properly.
   *
   * @return the cache stats provided by GUAVA
   */
  public CacheStats getCacheStats() {
    return this.cache.stats();
  }

  /**
   * Fetches the results of the query from the cache if available, otherwise sends a request to the
   * API.
   *
   * @param params - parameters of the API request
   * @return - the result of the API/cache query
   */
  public String sendRequest(HashMap<CoordBounds, Double> params) {
    // Use get method to fetch value from cache
    //    System.out.println(getCacheStats());
    return this.cache.getUnchecked(params);
  }

  @Override
  public String sendRequest(String keyword) {
    return this.datasource.sendRequest(keyword);
  }
}
