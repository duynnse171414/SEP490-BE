package org.example.entity;

public enum PackageLevel {
    BASIC(1), STANDARD(2), PREMIUM(3);

    private final int rank;

    PackageLevel(int rank) {
        this.rank = rank;
    }

    public int getRank() {
        return rank;
    }
}
