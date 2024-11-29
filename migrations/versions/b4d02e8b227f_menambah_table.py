"""menambah table

Revision ID: b4d02e8b227f
Revises: 
Create Date: 2024-11-22 17:10:55.462777

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b4d02e8b227f'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('admins',
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
    op.create_table('categories',
    sa.Column('id', sa.BigInteger(), autoincrement=True, nullable=False),
    sa.Column('category_name', sa.String(length=50), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('products',
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
    sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ),
    sa.ForeignKeyConstraint(['created_by'], ['admins.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('products')
    op.drop_table('categories')
    op.drop_table('admins')
    # ### end Alembic commands ###
