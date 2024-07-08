package utils.javautils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.core.config.Configurator;

/**
 * @author : Sanket Kumbhar
 * description- methods in this class used to creating log files of the test
 */
public class Log4j_LoggerUtil {

    private static final Logger logger = LogManager.getLogger("sunbird_saas");
    private static final String log4j2ConfigFile = System.getProperty("user.dir")+java.io.File.separator+"log4j2.properties";

    static {
        configureProperties();
    }

    private static void configureProperties() {
        try {
            Configurator.initialize("PropertiesConfig", log4j2ConfigFile);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static Logger getLogger(Class<?> classname) {
        return logger;
    }
}
