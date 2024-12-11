"""membuat tabel

Revision ID: 4aec3be9e577
Revises: 
Create Date: 2024-11-30 02:14:39.524137

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import text
from datetime import datetime
from werkzeug.security import generate_password_hash  


# revision identifiers, used by Alembic.
revision = '4aec3be9e577'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        'admins',
        sa.Column('id', sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(length=250), nullable=False),
        sa.Column('email', sa.String(length=60), nullable=False),
        sa.Column('password', sa.String(length=250), nullable=False),
        sa.Column('phone_number', sa.String(length=15), nullable=True),
        sa.Column('gender', sa.Enum('Laki-Laki', 'Perempuan'), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_table(
        'categories',
        sa.Column('id', sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column('category_name', sa.String(length=50), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_table(
        'products',
        sa.Column('id', sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column('created_by', sa.BigInteger(), nullable=False),
        sa.Column('category_id', sa.BigInteger(), nullable=False),
        sa.Column('product_name', sa.String(length=150), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('price', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('contact', sa.String(length=100), nullable=True),
        sa.Column('img_file', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['created_by'], ['admins.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###

    bind = op.get_bind()

    password_1 = generate_password_hash("password123", method="pbkdf2:sha256")

    bind.execute(
        text("""
        INSERT INTO admins (name, email, password, phone_number, gender, created_at, updated_at)
        VALUES 
        ('Admin', 'admin@gmail.com', :password_1, '081234567890', 'Laki-Laki', :created_at, :updated_at)
        """),
        {
            "password_1": password_1,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
    )

    bind.execute(
        text("""
        INSERT INTO categories (category_name, created_at, updated_at)
        VALUES 
        ('Kain', :created_at, :updated_at),
        ('Kayu', :created_at, :updated_at),
        ('Kertas', :created_at, :updated_at)
        """),
        {"created_at": datetime.now(), "updated_at": datetime.now()}
    )

    bind.execute(
        text("""
        INSERT INTO products (created_by, category_id, product_name, description, price, contact, img_file, created_at, updated_at)
        VALUES 
        (1, 1, 'Tas Kain Katun Organik', 'Tas kain berbahan katun organik, ideal untuk menggantikan kantong plastik saat berbelanja.', 89000.00, 'kontak@contoh.com', 'https://images.pexels.com/photos/8148587/pexels-photo-8148587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', :created_at, :updated_at),
        (1, 2, 'Alat Makan Kompos', 'Set alat makan berbahan kompos, cocok untuk penggunaan sekali pakai tanpa merusak lingkungan.', 120000.00, 'kontak@contoh.com', 'https://images.pexels.com/photos/4397820/pexels-photo-4397820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', :created_at, :updated_at),
        (1, 3, 'Wadah Biodegradable', 'Wadah makanan berbahan biodegradable, aman untuk lingkungan dan dapat terurai secara alami.', 5000.00, 'kontak@contoh.com', 'https://images.pexels.com/photos/12725408/pexels-photo-12725408.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', :created_at, :updated_at)
        """),
        {"created_at": datetime.now(), "updated_at": datetime.now()}
    )


def downgrade():
    op.drop_table('products')
    op.drop_table('categories')
    op.drop_table('admins')
    # ### end Alembic commands ###