package com.game.config;

import com.game.entity.Player;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.cfg.JdbcSettings;
import org.hibernate.cfg.SchemaToolingSettings;

public class DataBaseConfig {

    private DataBaseConfig() {
    }

    public static SessionFactory buildSessionFactory() {
        return new Configuration()
                .addAnnotatedClass(Player.class)
                .setProperty(JdbcSettings.JAKARTA_JDBC_URL, "jdbc:mysql://localhost:3306/rpg")
                .setProperty(JdbcSettings.DIALECT, "org.hibernate.dialect.MySQLDialect")
                .setProperty(JdbcSettings.JAKARTA_JDBC_DRIVER, "com.mysql.cj.jdbc.Driver")
                .setProperty(JdbcSettings.JAKARTA_JDBC_USER, "root")
                .setProperty(JdbcSettings.JAKARTA_JDBC_PASSWORD, "Toxaencom1")
                .setProperty(JdbcSettings.SHOW_SQL, "true")
                .setProperty(JdbcSettings.FORMAT_SQL, "true")
                .setProperty(SchemaToolingSettings.HBM2DDL_AUTO, "validate")
                .buildSessionFactory();
    }
}
