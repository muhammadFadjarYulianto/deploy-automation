from flask import request
from app.model.categories import Categories
from app.model.products import Products
from app import response, db

def indexCategory():
    try:
        categories = Categories.query.all()
        data = format_array(categories)
        return response.success(data, "success")
    except Exception as e:
        print(e)
        return response.badRequest([], "Gagal mengambil data kategori.", code=400)

def format_array(datas):
    return [single_object(data) for data in datas]

def single_object(data):
    return {
        'id': data.id,
        'category_name': data.category_name
    }

def detail_category(id):
    try:
        category = Categories.query.filter_by(id=id).first()

        if not category:
            return response.badRequest([], 'Kategori tidak ditemukan.', code=404)
        products = Products.query.filter_by(category_id=id).all()

        data = single_detail_category(category, products)

        return response.success(data, "Sukses", code=200)
    
    except Exception as e:
        print(e)
        return response.badRequest([], "Gagal mengambil detail kategori.", code=400)

def single_detail_category(category, products):
    return {
        'id': category.id,
        'category_name': category.category_name,
        'products': [single_product(product) for product in products]
    }

def single_product(product):
    return {
        'id': product.id,
        'created_by': product.admin.name,
        'category_name': product.category.category_name,
        'product_name': product.product_name,
        'description': product.description,
        'price': str(product.price),
        'contact': product.contact,
        'img_file': product.img_file,
        'created_at': product.created_at,
        'updated_at': product.updated_at
    }

def tambahCategory():
    try:
        category_name = request.form.get('category_name')
        if not category_name:
            return response.badRequest([], "Nama kategori wajib diisi.", code=400)
        if len(category_name) < 3:
            return response.badRequest([], "Nama kategori harus terdiri dari minimal 3 karakter.", code=400)
        if Categories.query.filter_by(category_name=category_name).first():
            return response.badRequest([], "Nama kategori sudah ada.", code=400)

        category = Categories(category_name=category_name)
        db.session.add(category)
        db.session.commit()
        return response.success(single_object(category), 'Sukses Menambahkan Data Category', code=201)
    except Exception as e:
        db.session.rollback()
        print(e)
        return response.badRequest([], "Gagal menambahkan kategori.", code=400)

def ubahCategory(id):
    try:
        category_name = request.form.get('category_name')
        if not category_name:
            return response.badRequest([], "Nama kategori wajib diisi.", code=400)

        category = Categories.query.filter_by(id=id).first()
        if not category:
            return response.badRequest([], "Kategori tidak ditemukan.", code=404)

        category.category_name = category_name
        db.session.commit()
        return response.success(single_object(category), 'Sukses update data kategori!', code=200)
    except Exception as e:
        db.session.rollback()
        print(e)
        return response.badRequest([], "Gagal mengubah data kategori.", code=400)

def hapusCategory(id):
    try:
        category = Categories.query.filter_by(id=id).first()
        if not category:
            return response.badRequest([], 'Kategori tidak ditemukan.', code=404)

        db.session.delete(category)
        db.session.commit()
        return response.success('', 'Berhasil menghapus kategori!', code=200)
    except Exception as e:
        db.session.rollback()
        print(e)
        return response.badRequest([], "Gagal menghapus kategori.", code=400)