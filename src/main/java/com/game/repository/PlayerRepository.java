package com.game.repository;

import com.game.config.DataBaseConfig;
import com.game.entity.Player;
import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class PlayerRepository {
    private final DataBaseConfig dataBaseConfig;

    public List<Player> getAll(int pageNumber, int pageSize) {
        try (SessionFactory sessionFactory = dataBaseConfig.buildSessionFactory();
             Session session = sessionFactory.openSession()) {
            Query<Player> query = session.createQuery("from Player", Player.class);
            query.setFirstResult(pageNumber * pageSize);
            query.setMaxResults(pageSize);
            return query.list();
        } catch (Exception e) {
            e.printStackTrace(System.out);
            return Collections.emptyList();
        }
    }

    public Long getAllCount() {
        try (SessionFactory sessionFactory = dataBaseConfig.buildSessionFactory();
             Session session = sessionFactory.openSession()) {
            Query<Long> query = session.createQuery("select count(p) from Player p", Long.class);
            return query.uniqueResult();
        } catch (Exception e) {
            e.printStackTrace(System.out);
            return 0L;
        }
    }

    public Player save(Player player) {
        try (SessionFactory sessionFactory = dataBaseConfig.buildSessionFactory();
             Session session = sessionFactory.openSession()) {
            Transaction transaction = session.beginTransaction();
            session.persist(player);
            transaction.commit();
            return player;
        } catch (Exception e) {
            e.printStackTrace(System.out);
            return null;
        }
    }

    public Player update(Player player) {
        try (SessionFactory sessionFactory = dataBaseConfig.buildSessionFactory();
             Session session = sessionFactory.openSession()) {
            Transaction transaction = session.beginTransaction();
            session.merge(player);
            transaction.commit();
            return player;
        } catch (Exception e) {
            e.printStackTrace(System.out);
            return null;
        }
    }

    public Optional<Player> findById(long id) {
        try (SessionFactory sessionFactory = dataBaseConfig.buildSessionFactory();
             Session session = sessionFactory.openSession()) {
            return Optional.of(session.find(Player.class, id));
        } catch (Exception e) {
            e.printStackTrace(System.out);
            return Optional.empty();
        }
    }

    public void delete(Player player) {
        try (SessionFactory sessionFactory = dataBaseConfig.buildSessionFactory();
             Session session = sessionFactory.openSession()) {
            Transaction transaction = session.beginTransaction();
            session.remove(player);
            transaction.commit();
        } catch (Exception e) {
            e.printStackTrace(System.out);
        }
    }
}