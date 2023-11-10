package com.sdplex.egg.utility;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class DataLoggerBulk {
	private final String url = "jdbc:postgresql://localhost/egg_board";
    private final String user = "postgres";
    private final String password = "sdplex1!";

    private static final String INSERT_DATA_SQL = "INSERT INTO data_logger" +
        "  (data_logger_idx, company_idx, sort_order, year, month, day, hour, minute, second, temp, rh) VALUES " +
        " (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    
    public static void main(String[] argv) throws SQLException {
    	//DataLoggerBulk csvInsert= new DataLoggerBulk();
    	
    	//List<List<String>> result = csvRead("E:\\meteorological\\logger_원성축산.csv");
    	//csvInsert.insertRecordG1(12872, 6, "경기도", "남양주시", "진접읍" , result);
    	
    	//List<List<String>> result = csvRead("E:\\meteorological\\logger_평택테이블.csv");
    	//csvInsert.insertRecordH1(4231, 2, "경기도", "평택시", "진위면" , result);
    	
    	//List<List<String>> result = csvRead("E:\\meteorological\\logger_계성테이블.csv");
    	//csvInsert.insertRecordH1(1, 4, "경기도", "광주시", "광남1동" , result);
    	
    	/*
    	for(List<String> csvRow : result) {
    		String year = csvRow.get(0).split("-")[0];
    		String month = csvRow.get(0).split("-")[1];
    		String day = csvRow.get(0).split("-")[2];
    		Double temp = Double.parseDouble(csvRow.get(2));
    		Double rh = Double.parseDouble(csvRow.get(3));
    		
    		String timeArr[] = csvRow.get(1).split(" ");
    		List<String> tmpList = Arrays.asList(timeArr);
    		String timeH = tmpList.get(1).split(":")[0];
    		String timeM = tmpList.get(1).split(":")[1];
    		String timeS = tmpList.get(1).split(":")[2];
    		if("PM".equalsIgnoreCase(tmpList.get(0))) {
    			if(!"12".equals(timeH)) {
    				timeH = String.valueOf(Integer.parseInt(timeH)+12);
    			}
    		}else {
    			if("12".equals(timeH)) {
    				timeH = "00";
    			}else if(!"11".equals(timeH) && !"10".equals(timeH)) {
    				timeH = "0"+timeH;
    			}
    		}
    		System.out.println(year+"::"+month+"::"+day+"::"+temp+"::"+rh+"::"+timeH+"::"+timeM+"::"+timeS);
    	}
    	*/
    }
    
    public void insertRecordG1(
    		long startIdx, long companyIdx,String si, String gu, String dong, 
    		List<List<String>> csvData) throws SQLException {
        try (Connection connection = DriverManager.getConnection(url, user, password);
            PreparedStatement preparedStatement = connection.prepareStatement(INSERT_DATA_SQL)) {
        	for(List<String> csvRow : csvData) {
        		String year = csvRow.get(0).split("-")[0];
        		String month = csvRow.get(0).split("-")[1];
        		String day = csvRow.get(0).split("-")[2];
        		Double temp = Double.parseDouble(csvRow.get(2));
        		Double rh = Double.parseDouble(csvRow.get(3));
        		
        		String timeArr[] = csvRow.get(1).split(" ");
        		List<String> tmpList = Arrays.asList(timeArr);
        		String timeH = tmpList.get(1).split(":")[0];
        		String timeM = tmpList.get(1).split(":")[1];
        		String timeS = tmpList.get(1).split(":")[2];
        		if("PM".equalsIgnoreCase(tmpList.get(0))) {
        			if(!"12".equals(timeH)) {
        				timeH = String.valueOf(Integer.parseInt(timeH)+12);
        			}
        		}else {
        			if("12".equals(timeH)) {
        				timeH = "00";
        			}else if(!"11".equals(timeH) && !"10".equals(timeH)) {
        				timeH = "0"+timeH;
        			}
        		}
        		
        		preparedStatement.setLong(1, startIdx);
        		preparedStatement.setLong(2, companyIdx);
        		preparedStatement.setLong(3, 1L);
        		preparedStatement.setString(4, year);
        		preparedStatement.setString(5, month);
        		preparedStatement.setString(6, day);
        		preparedStatement.setString(7, timeH);
                preparedStatement.setString(8, timeM);
                preparedStatement.setString(9, timeS);
                preparedStatement.setDouble(10, temp);
                preparedStatement.setDouble(11, rh);
                preparedStatement.executeUpdate();
                startIdx++;
        	}
        } catch (SQLException e) {
            printSQLException(e);
        }
    }
    
    public void insertRecordH1(
    		long startIdx, long companyIdx,String si, String gu, String dong, 
    		List<List<String>> csvData) throws SQLException {
        try (Connection connection = DriverManager.getConnection(url, user, password);
            PreparedStatement preparedStatement = connection.prepareStatement(INSERT_DATA_SQL)) {
        	for(List<String> csvRow : csvData) {
        		String timeArr[] = csvRow.get(1).split(" ");
        		List<String> tmpList = Arrays.asList(timeArr);
        		String year = tmpList.get(0).split("-")[0];
        		String month = tmpList.get(0).split("-")[1];
        		String day = tmpList.get(0).split("-")[2];
        		Double temp = Double.parseDouble(csvRow.get(3));
        		Double rh = Double.parseDouble(csvRow.get(2));
        		String timeH = tmpList.get(2).split(":")[0];
        		String timeM = tmpList.get(2).split(":")[1];
        		String timeS = tmpList.get(2).split(":")[2];
        		if("오후".equalsIgnoreCase(tmpList.get(1))) {
        			if(!"12".equals(timeH)) {
        				timeH = String.valueOf(Integer.parseInt(timeH)+12);
        			}
        		}else {
        			if("12".equals(timeH)) {
        				timeH = "00";
        			}else if(!"11".equals(timeH) && !"10".equals(timeH)) {
        				timeH = "0"+timeH;
        			}
        		}
        		
        		preparedStatement.setLong(1, startIdx);
        		preparedStatement.setLong(2, companyIdx);
        		preparedStatement.setLong(3, 1L);
        		preparedStatement.setString(4, year);
        		preparedStatement.setString(5, month);
        		preparedStatement.setString(6, day);
        		preparedStatement.setString(7, timeH);
                preparedStatement.setString(8, timeM);
                preparedStatement.setString(9, timeS);
                preparedStatement.setDouble(10, temp);
                preparedStatement.setDouble(11, rh);
                preparedStatement.executeUpdate();
                startIdx++;
        	}
        } catch (SQLException e) {
            printSQLException(e);
        }
    }
    
    public static void printSQLException(SQLException ex) {
        for (Throwable e: ex) {
            if (e instanceof SQLException) {
                e.printStackTrace(System.err);
                System.err.println("SQLState: " + ((SQLException) e).getSQLState());
                System.err.println("Error Code: " + ((SQLException) e).getErrorCode());
                System.err.println("Message: " + e.getMessage());
                Throwable t = ex.getCause();
                while (t != null) {
                    System.out.println("Cause: " + t);
                    t = t.getCause();
                }
            }
        }
    }
    
    public static List<List<String>> csvRead(String path){
        List<List<String>> ret = new ArrayList<>();
        
        try (BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(path),StandardCharsets.UTF_8));){
        //try (BufferedReader br = Files.newBufferedReader(Paths.get(path),Charset.forName("UTF-8"));){
            String line = "";
            boolean firstCheck = false;
            while((line = br.readLine()) != null) {
            	if(firstCheck) {
	                List<String> tmpList = new ArrayList<>();
	                String array[] = line.split(";");
	                tmpList = Arrays.asList(array);
                	ret.add(tmpList);
            	}
            	firstCheck = true;
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return ret;
    }
}
