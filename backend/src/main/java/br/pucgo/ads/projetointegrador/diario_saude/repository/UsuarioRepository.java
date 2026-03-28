package br.pucgo.ads.projetointegrador.diario_saude.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import br.pucgo.ads.projetointegrador.diario_saude.entity.UsuarioEntity;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Long> {

    @Query("""
                SELECT u FROM UsuarioEntity u
                WHERE u.user.role.name = 'ROLE_IDOSO'
            """)
    List<UsuarioEntity> findAllIdosos();

    Optional<UsuarioEntity> findByUser_Id(Long userId);

}