# _Bitacora_

## Sending sources to Hadoop file system

Windows/Linux local file system => Virtual Machine File System using scp: scp [SourcePath] username@domain:destinationPath

Using Cloudera HUE GUI to upload source files to Hadoop File System

## Setting up sqoop

If the jdbc driver is not in the system, an installation guide and download can be found here: https://www.microsoft.com/en-us/download/details.aspx?id=11774

Copy the Java 1.7 version of the sqljdbc into the folder /usr/lib/sqoop/lib/

Command example: sudo cp Downloads/sqljdbc_6.0/enu/jre7/sqljdbc41.jar /usr/lib/sqoop/lib/

## Importing SQL Server Database to Hive

sqoop import --connect 'jdbc:sqlserver://[INSERT IP HERE]:1433;databasename=ViajesDomesticosCR' --username 'sa' --warehouse-dir=/user/hive/warehouse --hive-import --compression-codec=snap --as-parquetfile -P --table reservaciones --split-by transactionId -m 1

1433 is Microsoft SQL Server default PORT

## Troubleshooting

java.lang.RuntimeException: Could not load db driver class: com.microsoft.sqlserver.jdbc.SQLServerDriver => https://www.mssqltips.com/sqlservertip/4445/sqoop-runtime-exception-cannot-load-sql-server-driver/

java.lang.UnsupportedClassVersionError: com/microsoft/sqlserver/jdbc/SQLServerDriver : Unsupported major.minor version 52.0 => Use sqljdbc41.jar for Java 1.