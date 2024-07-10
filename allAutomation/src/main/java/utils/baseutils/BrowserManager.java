package utils.baseutils;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openxmlformats.schemas.drawingml.x2006.main.STAdjAngle;
import utils.javautils.BaseUtils;
import utils.javautils.PropertiesFileManager;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import java.io.FileReader;
import java.util.Properties;


/*public class BrowserManager extends BaseUtils {
    static String locatorsPath = System.getProperty("user.dir") + "/src/test/java/test/resources/locators/";
    static {
        PropertiesFileManager.getInstance().setPath(locatorsPath);
    }
    private static String environment;
    static String envFilePath = "src/test/ENV.properties";
    public static void readEnvironment(String envFilePath) {
        try {
            byte[] encoded = Files.readAllBytes(Paths.get(envFilePath));
            environment = new String(encoded).trim();
        } catch (IOException e) {
            System.out.println("Error reading the file: " + e.getMessage());
                        System.out.println("Error reading the file: " + e.getMessage());
        }
    }
    public static void browserRun() throws Exception {
        FileReader fr = new FileReader(System.getProperty("user.dir") + "/src/test/java/test/resources/Test_data/browserConfig.properties");
        Properties prop = new Properties();
        prop.load(fr);
        String extensionPath = Paths.get("src").toAbsolutePath().toString();
        if (prop.getProperty("Browser").equalsIgnoreCase("chrome")) {
            ChromeOptions opt = new ChromeOptions();
            //opt.setHeadless(true);
//            opt.addArguments("--headless"); // Run Chrome in headless mode
            opt.addArguments("--remote-allow-origins=*");
            opt.addArguments("--incognito");
            opt.addArguments("--use-fake-ui-for-media-stream");
            driver = new ChromeDriver(opt);
        } else if (prop.getProperty("Browser").equalsIgnoreCase("firefox")) {
            FirefoxOptions opt = new FirefoxOptions();
            opt.setBinary("/usr/bin/firefox");
            driver = new FirefoxDriver(opt);
        } else if (prop.getProperty("Browser").equalsIgnoreCase("edge")) {
            EdgeOptions opt = new EdgeOptions();
            opt.addArguments("--remote-allow-origins=*");
            driver = new EdgeDriver();
        } else {
            System.out.println("Invalid Browser Selection");
        }
        driver.manage().window().maximize();
        readEnvironment(envFilePath);
        switch (environment)
        {
            case "QA" : driver.get("https://d114esnbvw5tst.cloudfront.net/");
            case "DEV" : driver.get("https://d114esnbvw5tst.cloudfront.net/");
        }

    }
    public static void main(String[] args) throws Exception {
        browserRun();
    }
}*/





public class BrowserManager extends BaseUtils {
    static String locatorsPath = System.getProperty("user.dir") + "/src/test/java/test/resources/locators/";
    static {
        PropertiesFileManager.getInstance().setPath(locatorsPath);
    }
    private static String environment;
    static String envFilePath = "src/test/ENV.properties";
    public static void readEnvironment(String envFilePath) {
        try {
            byte[] encoded = Files.readAllBytes(Paths.get(envFilePath));
            environment = new String(encoded).trim();
        } catch (IOException e) {
            System.out.println("Error reading the file: " + e.getMessage());
            System.out.println("Error reading the file: " + e.getMessage());
        }
    }
    public static void browserRun() throws Exception {
        FileReader fr = new FileReader(System.getProperty("user.dir") + "/src/test/java/test/resources/Test_data/browserConfig.properties");
        Properties prop = new Properties();
        prop.load(fr);
        if (prop.getProperty("Browser").equalsIgnoreCase("chrome")) {
            ChromeOptions opt = new ChromeOptions();
            //opt.setHeadless(true);
            opt.addArguments("--headless"); // Run Chrome in headless mode
            opt.addArguments("--no-sandbox"); // Bypass OS security model
            opt.addArguments("--disable-dev-shm-usage"); // Overcome limited resource problems
            opt.addArguments("--remote-debugging-port=9222");
            opt.addArguments("--disable-gpu"); //
            opt.addArguments("--remote-allow-origins=*");
            opt.addArguments("--incognito");
            opt.addArguments("--use-fake-ui-for-media-stream");
            opt.addArguments("--use-file-for-fake-audio-capture");
//            opt.addArguments("load-extension=:allAutomation\\src\\Extensions");

            driver = new ChromeDriver(opt);
        } else if (prop.getProperty("Browser").equalsIgnoreCase("firefox")) {
            FirefoxOptions opt = new FirefoxOptions();
            opt.setBinary("/usr/bin/firefox");
            driver = new FirefoxDriver(opt);
        } else if (prop.getProperty("Browser").equalsIgnoreCase("edge")) {
            EdgeOptions opt = new EdgeOptions();
            opt.addArguments("--remote-allow-origins=*");
            driver = new EdgeDriver();
        } else {
            System.out.println("Invalid Browser Selection");
        }
        driver.manage().window().maximize();
        readEnvironment(envFilePath);
        switch (environment)
        {
            case "QA" : driver.get("https://d114esnbvw5tst.cloudfront.net/");
            case "DEV" : driver.get("https://d114esnbvw5tst.cloudfront.net/");
        }
    }
    public static void main(String[] args) throws Exception {
        browserRun();
    }
}

