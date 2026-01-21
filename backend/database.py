from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import models  # Importa seu arquivo models.py

# URL para banco de dados SQLite assíncrono
DATABASE_URL = "sqlite+aiosqlite:///./test.db"

# Criando o motor (engine) de conexão
engine = create_async_engine(DATABASE_URL, echo=True)

# Configurando a sessão
async_session = sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

async def init_db():
    """Cria as tabelas no banco de dados"""
    async with engine.begin() as conn:
        # O segredo está aqui: usamos o metadata do models.py
        await conn.run_sync(models.Base.metadata.create_all)

async def get_db():
    """Dependência para injetar a sessão no FastAPI"""
    async with async_session() as session:
        yield session