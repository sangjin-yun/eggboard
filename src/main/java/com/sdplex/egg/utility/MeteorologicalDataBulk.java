package com.sdplex.egg.utility;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MeteorologicalDataBulk {
	
	private final String url = "jdbc:postgresql://localhost/egg_board";
    private final String user = "postgres";
    private final String password = "sdplex1!";

    private static final String INSERT_DATA_SQL = "INSERT INTO meteorological_data" +
        "  (addr_si, addr_gu, addr_dong, year, month, day, hour, minute, second, temp, rh, idx) VALUES " +
        " (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

    public static void main(String[] argv) throws SQLException {
    	//MeteorologicalDataBulk csvInsert= new MeteorologicalDataBulk();
    	/*
    	 * 기상청 데이터 csv파일 (기온파일에 습도 추가 편집필요)
    	List<List<String>> result = csvRead("E:\\meteorological\\서울특별시_송파구_오금동_202309.csv");
    	csvInsert.insertRecord("서울특별시", "송파구", "오금동", "09", result, 4465);
    	 */
    }
    
    /**
     * 
     세척1창고 경기도 평택시 진위면
	세척1판매 경기도 남양주시 별내동
	세칙1판매 서울시 송파구 오금동
	세척2창고 경기도 광주시 광남1동
	세척2판매 경기도 광주시 경안동
	비세척창고 경기도 남양주시 진접읍
	비세척판매 경기도 남양주시 별내동
     */
    public void insertRecord(
    		String si, String gu, String dong, String month, 
    		List<List<String>> csvData, long startIdx) throws SQLException {
        try (Connection connection = DriverManager.getConnection(url, user, password);
            PreparedStatement preparedStatement = connection.prepareStatement(INSERT_DATA_SQL)) {
        	int timeHour = 0;
        	for(List<String> csvRow : csvData) {
        		String day = csvRow.get(0);
        		Double temp = Double.parseDouble(csvRow.get(2));
        		Double rh = Double.parseDouble(csvRow.get(3));
        		
        		boolean timeCheck = false;
        		if(timeHour < 10) {
        			timeCheck = true;
        		}
        		String timeV = String.valueOf(timeHour);
        		if(timeCheck) {
        			timeV = "0"+timeV;
        		}
        		
        		if(Integer.parseInt(csvRow.get(0)) < 10) {
        			day = "0"+csvRow.get(0);
        		}
        		
        		preparedStatement.setString(1, si);
                preparedStatement.setString(2, gu);
                preparedStatement.setString(3, dong);
                preparedStatement.setString(4, "2023");
                preparedStatement.setString(5, month);
                preparedStatement.setString(6, day);
                preparedStatement.setString(7, timeV);
                preparedStatement.setString(8, "00");
                preparedStatement.setString(9, "00");
                preparedStatement.setDouble(10, temp);
                preparedStatement.setDouble(11, rh);
                preparedStatement.setDouble(12, startIdx);
                preparedStatement.executeUpdate();
                startIdx++;
                timeHour++;
                if(timeHour == 24) {
                	timeHour = 0;
                }
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
        
        try (BufferedReader br = Files.newBufferedReader(Paths.get(path),Charset.forName("UTF-8"));){
            String line = "";
            boolean firstCheck = false;
            while((line = br.readLine()) != null) {
            	if(firstCheck) {
	                List<String> tmpList = new ArrayList<>();
	                String array[] = line.split(",");
	                tmpList = Arrays.asList(array);
	                if(tmpList.size() > 1) {
	                	ret.add(tmpList);
	                }
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
