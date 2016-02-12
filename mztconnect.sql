SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP SCHEMA IF EXISTS `mydb` ;
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
SHOW WARNINGS;
DROP SCHEMA IF EXISTS `mztconnect` ;
CREATE SCHEMA IF NOT EXISTS `mztconnect` DEFAULT CHARACTER SET latin1 ;
SHOW WARNINGS;
USE `mydb` ;
USE `mztconnect` ;

-- -----------------------------------------------------
-- Table `mztconnect`.`locacao`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mztconnect`.`locacao` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `mztconnect`.`locacao` (
  `lcodigo` INT(11) NOT NULL AUTO_INCREMENT ,
  `tlcodigo` INT(11) NULL DEFAULT NULL ,
  `endereco` VARCHAR(100) NULL DEFAULT NULL ,
  `numero` VARCHAR(10) NULL DEFAULT NULL ,
  `complemento` VARCHAR(100) NULL DEFAULT NULL ,
  `cep` VARCHAR(20) NULL DEFAULT NULL ,
  PRIMARY KEY (`lcodigo`) )
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `mztconnect`.`mensagem`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mztconnect`.`mensagem` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `mztconnect`.`mensagem` (
  `mcodigo` INT(11) NOT NULL AUTO_INCREMENT ,
  `uorigem` INT(11) NOT NULL COMMENT 'Usuario Origem' ,
  `udestino` INT(11) NOT NULL COMMENT 'Usuario Destino' ,
  `momento` DATETIME NULL DEFAULT NULL ,
  `titulo` VARCHAR(100) NULL DEFAULT NULL ,
  `mensagem` VARCHAR(1000) NULL DEFAULT NULL ,
  `lida` CHAR(1) NULL DEFAULT 'N' ,
  PRIMARY KEY (`mcodigo`) )
ENGINE = InnoDB
AUTO_INCREMENT = 17
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `mztconnect`.`tipoLocacao`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mztconnect`.`tipoLocacao` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `mztconnect`.`tipoLocacao` (
  `tlcodigo` INT(11) NOT NULL AUTO_INCREMENT ,
  `descricao` VARCHAR(100) NULL DEFAULT NULL ,
  PRIMARY KEY (`tlcodigo`) )
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `mztconnect`.`usuario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mztconnect`.`usuario` ;

SHOW WARNINGS;
CREATE  TABLE IF NOT EXISTS `mztconnect`.`usuario` (
  `ucodigo` INT(11) NOT NULL AUTO_INCREMENT ,
  `login` VARCHAR(100) NULL DEFAULT NULL ,
  `senha` VARCHAR(100) NULL DEFAULT NULL ,
  `nome` VARCHAR(100) NULL DEFAULT NULL ,
  `sexo` CHAR(2) NULL DEFAULT NULL ,
  `nascimento` DATETIME NULL DEFAULT NULL ,
  `cpf` VARCHAR(20) NULL DEFAULT NULL ,
  `email` VARCHAR(100) NULL DEFAULT NULL ,
  `lcodigo` INT(11) NULL DEFAULT NULL ,
  PRIMARY KEY (`ucodigo`) )
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = latin1;

SHOW WARNINGS;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
