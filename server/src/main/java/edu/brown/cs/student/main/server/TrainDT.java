package edu.brown.cs.student.main.server;

import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.ml.classification.DecisionTreeClassificationModel;
import org.apache.spark.ml.classification.DecisionTreeClassifier;
import org.apache.spark.ml.feature.StringIndexer;
import org.apache.spark.ml.feature.StringIndexerModel;
import org.apache.spark.ml.feature.VectorAssembler;
import org.apache.spark.ml.tree.*;
//import org.apache.spark.ml.tree.DecisionTreeClassifier;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
public class TrainDT {
    public TrainDT() {
            // Create a Spark session
            SparkSession spark = SparkSession.builder()
                    .appName("DecisionTreeExample")
                    .master("local[*]")
                    .getOrCreate();

            // Load data from CSV file
            String filePath = "path/to/your/csv/file.csv";
            Dataset<Row> data = spark.read()
                    .option("header", "true") // Specify that the file has a header
                    .option("inferSchema", "true") // Let Spark infer the data types
                    .csv(filePath);

            // Index the label column if it is not already numeric
            StringIndexerModel labelIndexer = new StringIndexer()
                    .setInputCol("label") // Replace "label" with your label column name
                    .setOutputCol("indexedLabel")
                    .fit(data);
            Dataset<Row> dataWithIndexedLabel = labelIndexer.transform(data);

            // Assemble feature columns into a feature vector
            VectorAssembler assembler = new VectorAssembler()
                    .setInputCols(new String[] {"feature1", "feature2", "feature3"}) // Replace with your feature column names
                    .setOutputCol("features");
            Dataset<Row> assembledData = assembler.transform(dataWithIndexedLabel);

//            // Split data into training and testing sets (70% training, 30% testing)
            Dataset<Row>[] splits = assembledData.randomSplit(new double[]{0.7, 0.3});
            Dataset<Row> trainingData = splits[0];
            Dataset<Row> testingData = splits[1];
//
//            // Create a DecisionTreeClassifier
            DecisionTreeClassifier dtc = new DecisionTreeClassifier()
                    .setLabelCol("indexedLabel")
                    .setFeaturesCol("features");
//
//            // Train the decision tree model
            DecisionTreeClassificationModel model = dtc.fit(trainingData);
//
//            // Make predictions on the testing data
            Dataset<Row> predictions = model.transform(testingData);

            // Show predictions
            predictions.show();

            // Stop the Spark session
            spark.stop();


    }

    public static void main(String[] args) { new TrainDT();}
}
