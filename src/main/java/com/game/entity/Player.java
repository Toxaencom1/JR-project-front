package com.game.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@Builder
@Table(name = "player", schema = "rpg")
@AllArgsConstructor
@NoArgsConstructor
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String title;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Race race;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Profession profession;
    @Column(nullable = false)
    private Date birthday;
    @Column(nullable = false)
    private Boolean banned;
    @Column(nullable = false)
    private Integer level;
}