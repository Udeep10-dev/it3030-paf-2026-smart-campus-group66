import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String resourceCode;
    private String name;
    private String type;
    private Integer capacity;
    private String location;

    private LocalTime availabilityStart;
    private LocalTime availabilityEnd;

    @Enumerated(EnumType.STRING)
    private ResourceStatus status;

    private String description;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}