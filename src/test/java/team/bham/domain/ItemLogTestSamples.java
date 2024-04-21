package team.bham.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class ItemLogTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ItemLog getItemLogSample1() {
        return new ItemLog().id(1L);
    }

    public static ItemLog getItemLogSample2() {
        return new ItemLog().id(2L);
    }

    public static ItemLog getItemLogRandomSampleGenerator() {
        return new ItemLog().id(longCount.incrementAndGet());
    }
}
