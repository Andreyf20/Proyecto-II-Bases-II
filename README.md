# _Bitacora_

## Upgrading Cloudera to Java 1.8

https://blog.clairvoyantsoft.com/upgrading-to-java8-on-the-cloudera-quickstart-vm-48855b1bc430

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

## Zookeeper server

1. Agregar a la variable de sistema la variable JAVA_HOME: path/to/jdk

**\*Nota:** No incluir la carpeta bin ni el / final

2. Correr dentro de la carpeta bin de zookeeper: zkserver

## Start Kafka server

1. Correr dentro del bin de la carpeta windows: ..\..\config\server.properties kafka-server-start

2. Correr dentro de bin\windows: kafka-topics --create --bootstrap-server 25.108.214.3:9092 --replication-factor 1 --partitions 1 --topic busquedas. De igual manera con los demás topics.

3. Correr dentro de bin\windows: kafka-topics --list --bootstrap-server 25.108.214.3:9092. Este comando debe mostrar el topic _busquedas_. Similarmente para todos los topics.

**\*NOTA:** El nombre del directorio de kafka deber ser un nombre pequeño, como kafka, de otra manera se va a producir una excepción de "nombre muy largo".

## Server de MemSQL

[Referencia](https://hub.docker.com/r/memsql/cluster-in-a-box)

```
docker pull memsql/cluster-in-a-box

docker run -i --init --name memsql-ciab -e LICENSE_KEY=[License-key] -p 3306:3306 -p 8080:8080 memsql/cluster-in-a-box
```

## Express API

Se instalen las siguientes dependencias de npm:

- "@types/node": "14.0.26"
- "body-parser": "1.19.0"
- "express": "4.17.1"
- "kafkajs": "1.12.0"
- "morgan": "1.10.0"
- "ts-node": "8.10.2"
- "typescript": "3.9.7"

## Crear un pipeline de MemSQL con Kafka

REF: https://docs.memsql.com/v7.1/concepts/pipelines/kafka-pipeline-quickstart/

```
CREATE PIPELINE IF NOT EXISTS pipelinetest AS LOAD DATA KAFKA '25.108.214.3/busquedas'INTO TABLE test;

START PIPELINE pipelinetest;
```

## Crear un pipeline de MemSQL con HDFS

REF: https://docs.memsql.com/v7.1/concepts/pipelines/hdfs-pipelines-overview/

```
DROP PIPELINE pipelineHDFS;

CREATE PIPELINE pipelineHDFS AS LOAD DATA HDFS 'hdfs://25.104.59.86:8020/user/cloudera/output/' INTO TABLE testHDFS FIELDS TERMINATED BY ',';

SELECT * FROM information_schema.pipelines_files WHERE pipeline_name = 'pipelineHDFS';

START PIPELINE pipelineHDFS FOREGROUND LIMIT 1 BATCHES;
```
