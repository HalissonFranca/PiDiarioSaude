package br.pucgo.ads.projetointegrador.diario_saude.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.pucgo.ads.projetointegrador.diario_saude.entity.UsuarioEntity;

<<<<<<< HEAD
public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Long>{
    
=======
<<<<<<< HEAD
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Long>{
    Optional<UsuarioEntity> findByUserId(Long userId);
=======
public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Long>{
    
>>>>>>> 642918d614cd2e5e6344c70451602c5148974576
>>>>>>> 8d723c75dea8e98c051b7ee5bdebfd20b5e0e829
}
