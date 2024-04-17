package edu.brown.cs.student.main.server;

/**
 * Enum with names for the bounds in all directions for a coordinate bounding box. Eliminates need
 * to remember order for a list of coordinates. Used as HashMap keys for handling requests.
 */
public enum CoordBounds {
  MAXLAT,
  MINLAT,
  MAXLONG,
  MINLONG;
}
