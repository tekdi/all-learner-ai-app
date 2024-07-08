package utils.javautils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;
import java.util.Properties;

//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
/**
 * @author: Sanket Kumbhar
 */
public class PropertiesFileManager {
	
	
//--------sl4j dependencies added in pom.xml-- imported to replace sop statements
//	private static final Logger logger = LoggerFactory.getLogger(PropertiesFileManager.class);
	private static final PropertiesFileManager instance = new PropertiesFileManager();
//.........hashtable is used to store properties instead we can use has map...Map increase synchronization posibilities
	private static Hashtable<String, Properties> propertiesMap;

//.....Default directory path which 
	private  String defaultpath;

    // Method to set a custom directory path
    public void setPath(String customPath) {
        this.defaultpath = customPath;
        // Reload properties files with the new path
        propertiesMap = loadPropertiesFiles();
    }

    // Method to get the current directory path
    public String getDefaultPath() {
        return defaultpath;
    }
//......Private constructor=prevent direct instantiation and is responsible for loading properties files into the propertiesMap.  
	private PropertiesFileManager() {
		propertiesMap = new Hashtable<>();
	}

//......get instance   
	public static PropertiesFileManager getInstance() {
		return instance;
	}

//....... get properties file name  
	public Properties getProperties(String fileName) {
		return propertiesMap.get(fileName);
	}

//.........load desired properties file into map  
	private Hashtable<String, Properties> loadPropertiesFiles() {

//........list of properties files    	

		/**
		 * Arrays.asList is a convenient method for creating a fixed-size List backed by an array. 
		 * It allows you to initialize a List with the specified elements in a compact manner. 
		 * However, the resulting list's size cannot be changed once it's created,
		 *  so you cannot add or remove elements from it directly.
		 *  refer below.
		 */

		List<String> filePaths=new ArrayList<>();
		File fileFromDir= new File(defaultpath);
		
		for(File file:fileFromDir.listFiles()) {
			String propertyFile=file.getName();
			if(propertyFile.toLowerCase().endsWith(".properties")) {
				filePaths.add(propertyFile);
			}
		}
//........Hashtable to store properties      
		Hashtable<String, Properties> propertiesMap = new Hashtable<>();

		for (String filePath : filePaths) {

//.......load properties form file 
			Properties properties = loadPropertiesFromFile(defaultpath + filePath);
//.......adding file name as key into the mapp          
			propertiesMap.put(filePath, properties);
		}

		return propertiesMap;
	}

//............load properties from file     
	@SuppressWarnings("static-access")
	private Properties loadPropertiesFromFile(String filePath) {
		Properties properties = new Properties();
//.........loads properties from a file using a FileInputStream and adds them to a new Properties object.       
		try (FileInputStream fileInputStream = new FileInputStream(filePath)) {
			properties.load(fileInputStream);
		} catch (IOException e) {
			LoggerUtil.getInstance().getLogger().warning("Error loading properties file: " + filePath);
			e.printStackTrace();
		}

		return properties;
	}

	/*
	 * 
	 * public static void main(String[] args) { PropertiesFileManager loader =
	 * PropertiesFileManager.getInstance(); System.out.println(propertiesMap);
	 * //=========== Enumeration<String> e = propertiesMap.keys();
	 * 
	 * 
	 * // Iterating through the Hashtable object // Checking for next element in
	 * Hashtable object // with the help of hasMoreElements() method
	 * 
	 * 
	 * while (e.hasMoreElements()) {
	 * 
	 * // Getting the key of a particular entry String key = e.nextElement();
	 * 
	 * // Print and display the Rank and Name
	 * System.out.println("----------------------------Key : " + key +
	 * "\t\n Property object : \n" + propertiesMap.get(key)); }
	 * 
	 * //======= // Access properties by file name
	 * 
	 * 
	 * Properties properties1 = loader.getProperties("login.properties");
	 * 
	 * 
	 * System.out.println(properties1);
	 * 
	 * if (properties1 != null) { String value =
	 * properties1.getProperty("Exp_apex_btn");
	 * System.out.println("Value from file1.properties: " + value); }
	 * 
	 * Properties properties2 = loader.getProperties("creatormenu.properties"); if
	 * (properties2 != null) { String value = properties2.getProperty("avatoricon");
	 * System.out.println("Value from file2.properties: " + value); }
	 * 
	 * // ... Access other properties files as needed }
	 * 
	 */
}
