package br.pucgo.ads.projetointegrador.diario_saude.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.pucgo.ads.projetointegrador.diario_saude.entity.UsuarioEntity;

<<<<<<< HEAD
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Long>{
    Optional<UsuarioEntity> findByUserId(Long userId);
=======
public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Long>{
    
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
}
