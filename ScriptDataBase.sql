USE [master]
GO
/****** Object:  Database [PMSPTechTest]    Script Date: 9/30/2020 10:22:24 AM ******/
CREATE DATABASE [PMSPTechTest]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'PMSPTechTest', FILENAME = N'C:\Users\tc.monteiro\PMSPTechTest.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'PMSPTechTest_log', FILENAME = N'C:\Users\tc.monteiro\PMSPTechTest_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [PMSPTechTest] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [PMSPTechTest].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [PMSPTechTest] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [PMSPTechTest] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [PMSPTechTest] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [PMSPTechTest] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [PMSPTechTest] SET ARITHABORT OFF 
GO
ALTER DATABASE [PMSPTechTest] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [PMSPTechTest] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [PMSPTechTest] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [PMSPTechTest] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [PMSPTechTest] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [PMSPTechTest] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [PMSPTechTest] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [PMSPTechTest] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [PMSPTechTest] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [PMSPTechTest] SET  ENABLE_BROKER 
GO
ALTER DATABASE [PMSPTechTest] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [PMSPTechTest] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [PMSPTechTest] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [PMSPTechTest] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [PMSPTechTest] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [PMSPTechTest] SET READ_COMMITTED_SNAPSHOT ON 
GO
ALTER DATABASE [PMSPTechTest] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [PMSPTechTest] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [PMSPTechTest] SET  MULTI_USER 
GO
ALTER DATABASE [PMSPTechTest] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [PMSPTechTest] SET DB_CHAINING OFF 
GO
ALTER DATABASE [PMSPTechTest] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [PMSPTechTest] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [PMSPTechTest] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [PMSPTechTest] SET QUERY_STORE = OFF
GO
USE [PMSPTechTest]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 9/30/2020 10:22:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbExcel]    Script Date: 9/30/2020 10:22:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbExcel](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[DataEntrega] [datetime2](7) NOT NULL,
	[NomeProduto] [nvarchar](50) NOT NULL,
	[Quantidade] [int] NOT NULL,
	[ValorUnitario] [decimal](18, 2) NOT NULL,
 CONSTRAINT [PK_tbExcel] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tbImportacao]    Script Date: 9/30/2020 10:22:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbImportacao](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[DtImportacao] [datetime] NOT NULL,
	[TotalItens] [int] NOT NULL,
	[DtMenorEntrega] [datetime] NOT NULL,
	[VlTotal] [decimal](18, 2) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
USE [master]
GO
ALTER DATABASE [PMSPTechTest] SET  READ_WRITE 
GO