#_Bitacora_

##Sending sources to Hadoop file system

Windows/Linux local file system => Virtual Machine File System using scp: scp [SourcePath] username@domain:destinationPath

Using Cloudera HUE GUI to upload source files to Hadoop File System

##Importing SQL Server Database to Hive

sqoop import --connect 'jdbc:sqlserver://192.168.100.43:1433;databasename=ViajesDomesticosCR' --username 'sa' --warehouse-dir=/user/hive/warehouse --hive-import --compression-codec=snap --as-parquetfile -P --table reservaciones --split-by transactionId -m 1

##Troubleshooting

java.lang.RuntimeException: Could not load db driver class: com.microsoft.sqlserver.jdbc.SQLServerDriver => https://www.mssqltips.com/sqlservertip/4445/sqoop-runtime-exception-cannot-load-sql-server-driver/

java.lang.UnsupportedClassVersionError: com/microsoft/sqlserver/jdbc/SQLServerDriver : Unsupported major.minor version 52.0 => Update java =>
Use sqljdbc41.jar for Java 1.7
