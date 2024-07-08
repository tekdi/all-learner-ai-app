package utils.javautils;

import java.io.*;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.Date;
import java.util.Properties;
import java.util.logging.FileHandler;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;

/**
 * LoggerUtil class encapsulates several utility methods that helps logging. It
 * consolidates all logs in one single file and creates new file for every run.
 * The log file is generated in 'logs' directory. It provides convenient methods
 * for: - measuring time of execution. - Dumping stack trace in log files
 *
 * It also sets pattern of logs with TimeStamp and Log level
 *
 * @author Mandar Wadhavekar
 *
 */
public class LoggerUtil {

	private static FileHandler logFileHandler = null;
	private static SimpleFormatter simpleFormatter = null;
	private static Logger logger = null;
	//	private static String logFileDir = "./logs/";
	private static Instant startInstant = null; // to measure time
	private static FileReader fr;
	private static Properties prop;
	static String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());

	// static initializer for the class
	static {
		// System.setProperty("java.util.logging.SimpleFormatter.format",
		// "[%1$tF %1$tT] [%4$-7s] %5$s %n");
		System.setProperty("java.util.logging.SimpleFormatter.format", "[%1$tF %1$tT] [%4$-7s] %5$s %n");

		try {
			fr = new FileReader("."+java.io.File.separator+"logger.properties");
			prop = new Properties();

			prop.load(fr);
		} catch (Exception e1) {

			e1.printStackTrace();
		}
		// Naming to directory of log file-sanket
		String parentDirectory="."+java.io.File.separator+"logs";
		String logFileDir = parentDirectory + java.io.File.separator +timestamp+ java.io.File.separator;

		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("-YY-MM-dd_HHmmss");
		System.out.println("======>>>> LOG_FILE_NAME from Constants " + prop.getProperty("logfilename"));
		String logFileName = prop.getProperty("logfilename") + simpleDateFormat.format(Calendar.getInstance().getTime())
				+ ".log";
		// String logFileName = System.getProperty(Constant.LOG_FILE_NAME.getValue()) +
		// simpleDateFormat.format(Calendar.getInstance().getTime()) + ".log";
		System.out.println("======:::: LOG_FILE_NAME " + logFileName);
		System.out.println("======:::: LOG_FILE_DIR " + logFileDir);
		try {
			File file = new File(logFileDir);

			if (file.exists() == false) {
				System.out.println("Creating directory: " + logFileDir);
				System.out.println("Creating directory: " + logFileDir);

				File directory = new File(logFileDir);
				directory.mkdir(); // create logs directory
			} else {
				System.out.println("The directory already exists: " + logFileDir);
			}

			logFileHandler = new FileHandler(logFileDir + logFileName, true);
			simpleFormatter = new SimpleFormatter();

			logFileHandler.setFormatter(simpleFormatter);
			logger = Logger.getLogger("SunbirdSaas-logger"); // just naming the logger
			// logger.setUseParentHandlers(false);
			logger.addHandler(logFileHandler);

			// to set specific log level-Sanket
			String logLevel = prop.getProperty("logLevel");
			Level level;
			switch (logLevel.toUpperCase()) {
				case "SEVERE":
					level = Level.SEVERE;
					break;
				case "WARNING":
					level = Level.WARNING;
					break;
				case "INFO":
					level = Level.INFO;
					break;
				case "CONFIG":
					level = Level.CONFIG;
					break;
				case "FINE":
					level = Level.FINE;
					break;
				case "FINER":
					level = Level.FINER;
					break;
				case "FINEST":
					level = Level.FINEST;
					break;
				default:
					level = Level.INFO; // Default level if the value is not recognized
					break;
			}

			logger.setLevel(level); // TODO: read this from properties file Mandar Wadhavekar

		} catch (IOException ioe) {
			logger.warning("================= FATAL ERROR ===========================" + logFileName);
			System.out.println("================= FATAL ERROR ===========================");
			System.out.println("IOException while creating log file: " + logFileName + " in directory: " + logFileDir);
			ioe.printStackTrace();
		} catch (Exception e) {
			System.out.println("================= FATAL ERROR ===========================");
			System.out.println("Exception while creating log file : " + logFileName + " in directory: " + logFileDir);
			e.printStackTrace();
		}
	} // end of static block

	/**
	 * This method returns the logFileHandler This method may be needed only if some
	 * class want to do specific coding
	 *
	 * @return FileHandler
	 */
	public static FileHandler getLogFileHandler() {
		return logFileHandler;
	}

	/**
	 * This methods returns Logger so that classes can put in log statements
	 *
	 * @return Logger
	 */
	public static Logger getLogger() {

		return logger;
	}

	/**
	 * Log details of exception - exception's message and stack trace
	 *
	 * @param exception
	 */
	public static void logException(Exception exception) {

		logException(exception, "");
	}

	/**
	 * Log details of exception - exception's error message, custom message and
	 * stack trace
	 *
	 * @param exception
	 */
	public static void logException(Exception exception, String customMessage) {

		logger.severe("!!!    EXCEPTION Occurred    !!!");
		logger.severe(customMessage);
		logger.severe("------------------- Exception Error Message is: --------------");
		logger.severe(exception.getMessage());

		/*
		 * This method does not print stack trace logger.log(Level.SEVERE,
		 * customMessage+"trying logger.log with throwable ", exception );
		 */
		logger.severe("=================== Exception stack trace ====================");
		logger.severe(convertStackTraceToString(exception));

	}

	/**
	 * Starts measurement of time using Instant. Returns java.time.Instant class but
	 * caller method can ignore it if they just want to measure time and not
	 * interested in other details of the Instant
	 *
	 * @return Instant
	 */
	public static Instant startTimeMeasurement() {
		startInstant = Instant.now();
		logger.log(Level.INFO, "Started measuring time " + startInstant); // TODO: Change level to FINER - Mandar
		// Wadhavekar
		return startInstant;
	}

	/**
	 * Stop Time Measurement and print time taken since last startTimeMeasurement.
	 */
	public static void stopTimeMeasurement() {
		stopTimeMeasurement(null);
	}

	/**
	 * Stop Time Measurement and print time taken since last startTimeMeasurement
	 * and also print the custom message. This can be utilized in following
	 *
	 * @param message
	 */
	public static void stopTimeMeasurement(String message) {
		Instant finishInstant = Instant.now();
		long timeElapsed = Duration.between(startInstant, finishInstant).toMillis();
		if (message != null) {
			logger.log(Level.INFO, message);
		}
		logger.log(Level.INFO,
				"Time elapsed - [In milli-seconds: " + timeElapsed + "] [In seconds:" + timeElapsed / 1000.0 + "]");

	}

	/**
	 * Converts stack trace to String Mainly to dump it in log file.
	 *
	 * @param throwable the exception for which stack trace is to be converted into
	 *                  string
	 * @return
	 */
	private static String convertStackTraceToString(Throwable throwable) {
		try (StringWriter sw = new StringWriter(); PrintWriter pw = new PrintWriter(sw)) {
			throwable.printStackTrace(pw);
			return sw.toString();
		} catch (IOException ioe) {
			throw new IllegalStateException(ioe);
		}
	}



	// To delete old log files


	private static LoggerUtil instance;
	private String directoryPath;

	private LoggerUtil() {
		// Set the directory path where the report files are stored
		directoryPath = System.getProperty("user.dir") +java.io.File.separator+ "logs"+java.io.File.separator;
	}

	public static LoggerUtil getInstance() {
		if (instance == null) {
			synchronized (LoggerUtil.class) {
				if (instance == null) {
					instance = new LoggerUtil();
				}
			}
		}
		return instance;
	}

	public void deleteOldLogFiles(int days) {
		// Calculate the deletion threshold date

		/*here locldate object from java.time used to calculate date usign minus () in that
		 * mention days then it will get substracted from current day
		 * suppose day 5running then it will delete 3day
		 *
		 * */
		LocalDate deletionThreshold = LocalDate.now().minus(days, ChronoUnit.DAYS);

		// Get the list of files in the directory
		File directory = new File(directoryPath);
		File[] files = directory.listFiles();

		// Iterate through the files and delete if older than the threshold
		for (File file : files) {
			LocalDate fileDate = LocalDate.ofEpochDay(file.lastModified() / (24 * 60 * 60 * 1000));

			if (fileDate.isBefore(deletionThreshold)) {
				// Delete the file
				if (file.delete()) {
					System.out.println("Deleted file: " + file.getName());
				} else {
					System.out.println("Failed to delete file: " + file.getName());
				}
			}
		}
	}

}