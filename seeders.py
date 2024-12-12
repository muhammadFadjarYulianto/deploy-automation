import os
import uuid
from werkzeug.utils import secure_filename
from shutil import copyfile
from app import db, app
from app.model.admins import Admins
from app.model.categories import Categories
from app.model.products import Products
from app.model.articles import Articles
from app.model.comments import Comments

GAMBAR_SEED_FOLDER = 'gambar_seed'
PRODUCT_FOLDER = 'app/static/products'
ARTICLE_FOLDER = 'app/static/articles'

def rename_and_save_image(filename, folder_type):

    uid = uuid.uuid4()
    filename = secure_filename(filename)
    
    if folder_type == 'product':
        renamed_file = f"GreenLify-Product-{uid}-{filename}"
        save_path = os.path.join(PRODUCT_FOLDER, renamed_file)
        file_path = os.path.join(app.config['PRODUCT_URL_PATH'], renamed_file).replace('\\', '/')
        img_url = f"{os.getenv('BASE_URL')}{file_path}"

    elif folder_type == 'article':
        renamed_file = f"GreenLify-Article-{uid}-{filename}"
        save_path = os.path.join(ARTICLE_FOLDER, renamed_file)
        file_path = os.path.join(app.config['ARTICLE_URL_PATH'], renamed_file).replace('\\', '/')
        img_url = f"{os.getenv('BASE_URL')}{file_path}"

    source_path = os.path.join(GAMBAR_SEED_FOLDER, filename)

    if os.path.exists(source_path):
        copyfile(source_path, save_path)
        return img_url
    else:
        raise FileNotFoundError(f"File {filename} tidak ditemukan di folder gambar_seed.")

def clear_static_folders():
    if os.path.exists(PRODUCT_FOLDER) and os.listdir(PRODUCT_FOLDER):
        for filename in os.listdir(PRODUCT_FOLDER):
            file_path = os.path.join(PRODUCT_FOLDER, filename)
            if os.path.isfile(file_path):
                os.remove(file_path)

    if os.path.exists(ARTICLE_FOLDER) and os.listdir(ARTICLE_FOLDER):
        for filename in os.listdir(ARTICLE_FOLDER):
            file_path = os.path.join(ARTICLE_FOLDER, filename)
            if os.path.isfile(file_path):
                os.remove(file_path)

def run_seeder():
    try:
        clear_static_folders()

        admin = Admins(
            name='Admin',
            email='admin@gmail.com',
            phone_number='081234567890',
            gender='Laki-Laki',
        )
        admin.setPassword('password123')

        category1 = Categories(category_name='Kain')
        category2 = Categories(category_name='Kayu')
        category3 = Categories(category_name='Kertas')

        product1_img_url = rename_and_save_image('tas_kain.jpeg', 'product')
        product2_img_url = rename_and_save_image('alat_makan_kompos.jpeg', 'product')
        product3_img_url = rename_and_save_image('wadah_biodegradable.jpeg', 'product')

        product1 = Products(
            created_by=1,
            category_id=1,
            product_name='Tas Kain Katun Organik',
            description='Tas kain berbahan katun organik, ideal untuk menggantikan kantong plastik saat berbelanja.',
            price=89000.00,
            contact='kontak@contoh.com',
            img_file=product1_img_url,
        )
        product2 = Products(
            created_by=1,
            category_id=2,
            product_name='Alat Makan Kompos',
            description='Set alat makan berbahan kompos, cocok untuk penggunaan sekali pakai tanpa merusak lingkungan.',
            price=120000.00,
            contact='kontak@contoh.com',
            img_file=product2_img_url,
        )
        product3 = Products(
            created_by=1,
            category_id=3,
            product_name='Wadah Biodegradable',
            description='Wadah makanan berbahan biodegradable, aman untuk lingkungan dan dapat terurai secara alami.',
            price=5000.00,
            contact='kontak@contoh.com',
            img_file=product3_img_url,
        )

        article1_img_url = rename_and_save_image('tas_kain.jpeg', 'article')
        article2_img_url = rename_and_save_image('alat_makan_kompos.jpeg', 'article')
        article3_img_url = rename_and_save_image('wadah_biodegradable.jpeg', 'article')

        article1 = Articles(
            created_by=1,
            title='Keuntungan Menggunakan Tas Kain Katun Organik',
            img_file=article1_img_url,
            content='Tas kain berbahan katun organik, ideal untuk menggantikan kantong plastik saat berbelanja.',
            views=120,
            author='Admin',
        )
        article2 = Articles(
            created_by=1,
            title='Manfaat Alat Makan Kompos',
            img_file=article2_img_url,
            content='Set alat makan berbahan kompos, cocok untuk penggunaan sekali pakai tanpa merusak lingkungan.',
            views=80,
            author='Admin',
        )
        article3 = Articles(
            created_by=1,
            title='Wadah Biodegradable: Solusi Ramah Lingkungan',
            img_file=article3_img_url,
            content='Wadah makanan berbahan biodegradable, aman untuk lingkungan dan dapat terurai secara alami.',
            views=150,
            author='Admin',
        )

        comment1 = Comments(
            id_article=1,
            username='Budi',
            email='budi@gmail.com',
            comment='Tas kain ini sangat praktis dan ramah lingkungan, saya suka sekali!',
            is_approved=True,
            status='APPROVED',
        )
        comment2 = Comments(
            id_article=2,
            username='Siti',
            email='siti@gmail.com',
            comment='Alat makan kompos ini sangat bermanfaat dan bagus untuk lingkungan.',
            is_approved=True,
            status='APPROVED',
        )
        comment3 = Comments(
            id_article=3,
            username='Andi',
            email='andi@gmail.com',
            comment='Wadah biodegradable ini sangat berguna untuk menyimpan makanan dengan aman.',
            is_approved=True,
            status='APPROVED',
        )

        db.session.add_all([admin, category1, category2, category3, product1, product2, product3, article1, article2, article3, comment1, comment2, comment3])
        db.session.commit()

        print("Seeder berhasil dijalankan. Database telah diisi dengan data ramah lingkungan.")
    except Exception as e:
        print(f"Terjadi kesalahan saat menjalankan seeder: {e}")
        db.session.rollback()

if __name__ == "__main__":
    with app.app_context():
        run_seeder()
