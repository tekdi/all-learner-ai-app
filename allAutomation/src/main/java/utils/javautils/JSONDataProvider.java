
package utils.javautils;

import org.json.JSONObject;
import org.testng.annotations.DataProvider;

import java.io.IOException;
import java.lang.reflect.Method;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * @author: Sanket Kumbhar
 */
public class JSONDataProvider {
    
    // Declare private static variables to hold directory path and file name
    private static String dirPath, fileName;

    // Setter method for setting the directory path
    public static void setDirPath(String path) {
        dirPath = path;
    }

    // Getter method for retrieving the directory path
    public static String getDirPath() {
        return dirPath;
    }
    
    // Setter method for setting the file name
    public static void setFileName(String name) {
        fileName = name;
    }

    // Getter method for retrieving the file name
    public static String getFileName() {
        return fileName;
    }

    // DataProvider annotation with the name "testData"
    @DataProvider(name="testData")
    public Object[][] getTestData(Method method) {
        // Get the name of the test method
        String methodName = method.getName();
        
        // Build the complete file path by combining directory path and file name
        String filePath = dirPath + fileName;
        
        try {
            // Read the content of the JSON file into a string
            String jsonData = new String(Files.readAllBytes(Paths.get(filePath)));
            
            // Parse the JSON data into a JSONObject
            JSONObject jsonObject = new JSONObject(jsonData);

            // Check if the JSONObject contains a key matching the test method name
            if (jsonObject.has(methodName)) {
                // Get the JSON data associated with the test method
                JSONObject testData = jsonObject.getJSONObject(methodName);
                
                // Wrap the test data in a two-dimensional Object array and return
                return new Object[][]{{testData}};
            } else {
                // If no data is found for the test method, return an empty Object array
                return new Object[0][0];
            }
        } catch (IOException e) {
            // Handle exceptions related to file reading
            e.printStackTrace();
            
            // Return an empty Object array in case of an exception
            return new Object[0][0];
        }
    }
}
