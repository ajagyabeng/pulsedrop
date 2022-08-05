from flask import Flask, render_template, request, url_for, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bootstrap import Bootstrap5
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env.

# APP_SECRET_KEY = os.getenv('APP_SECRET_KEY')
# DB_USERNAME = os.getenv('DB_USERNAME')
# DB_PASSWORD = os.getenv('DB_PASSWORD')

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('APP_SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
Bootstrap5(app)
db = SQLAlchemy(app)

# value to be placed in here from the filter function and used to fine tune filter queries
FILTER_KIND = ""


class NftCards(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    card_name = db.Column(db.String(), nullable=False, unique=True)
    card_img_url = db.Column(db.String())
    blockchain = db.Column(db.String(), nullable=False)
    blockchain_logo_url = db.Column(db.String())
    status = db.Column(db.String(), default='N/A')
    favorite = db.Column(db.Boolean, nullable=False, default=False)
    price = db.Column(db.String(), default='N/A')


# db.create_all()

# cards = NftCards(
#     card_name='Diplomats of Tezotopia',
#     card_img_url='https://assets.website-files.com/6215f2e803b86a29a8f37aba/6215f70a328ad284821e11ce_64dec28a.png',
#     blockchain='Tezos',
#     blockchain_logo_url='https://assets.website-files.com/6215f2e803b86a29a8f37aba/6215f329e85caa0afe27b26f_Tezos.png',
#     status='Live',
#     price='333'
# )

# db.session.add(cards)
# db.session.commit()


@app.route('/')
def home():
    # ordering by id makes sure that they always appear in the right order even after implementing and event listener in JS.
    nft_cards = NftCards.query.filter_by(status='Live').order_by('id').all()
    return render_template('index.html', cards=nft_cards)


@app.route('/add_favorite/<card_id>', methods=['POST'])
def add_favorites(card_id):
    favorited = request.get_json()['favorite']
    card_to_favorite = NftCards.query.get(card_id)
    card_to_favorite.favorite = favorited
    db.session.commit()
    return redirect(url_for('home'))


@app.route('/remove_favorite/<card_id>', methods=['POST'])
def remove_favorite(card_id):
    not_favorited = request.get_json()['favorite']
    card_to_remove = NftCards.query.get(card_id)
    card_to_remove.favorite = not_favorited
    db.session.commit()
    return redirect(url_for('get_favorites'))


@app.route('/favorites', methods=['GET'])
def get_favorites():
    fav_cards = NftCards.query.filter_by(favorite='True').order_by('id').all()
    return render_template('favorites.html', cards=fav_cards)


def format_result(result):
    """formats the result parameter into a dictionary"""
    return{
        "id": result.id,
        "card_name": result.card_name,
        "card_img_url": result.card_img_url,
        "blockchain": result.blockchain,
        "blockchain_logo_url": result.blockchain_logo_url,
        "status": result.status,
        "favorite": result.favorite,
        "price": result.price
    }


@app.route('/search', methods=['GET'])
def search():
    """receives search term from front-end and returns result in a json format"""
    text = request.args.get('name')
    # ilike searches for items from DB that are similar to the search word
    if text == '':
        result = NftCards.query.order_by('id').all()
    else:
        result = NftCards.query.filter(
            NftCards.card_name.ilike(f"%{text}%")).all()
    # filter returns the names that contain the entered text.
    result_list = []
    for item in result:
        result_list.append(format_result(item))
    return {"cards": result_list}


@app.route('/filter', methods=['GET'])
def filter_cards():
    filter_type = request.args.get('filter_status')
    FILTER_KIND = filter_type
    if filter_type == 'Live':
        result = NftCards.query.filter_by(status=filter_type).all()
    elif filter_type == 'All':
        result = NftCards.query.order_by('id').all()
    else:
        result = NftCards.query.filter(
            NftCards.status.notlike(f"%Live%")).all()

    result_list = []
    for item in result:
        result_list.append(format_result(item))
    return {"cards": result_list}


@app.route('/blc_filter')
def blc_filter():
    filter_type = request.args.get('filter_blc')
    if FILTER_KIND == "" or FILTER_KIND == "All":
        result = NftCards.query.filter_by(blockchain=filter_type).all()
    else:
        result = NftCards.query.filter(NftCards.status.like(
            f"%{FILTER_KIND}%"), NftCards.blockchain.like(f"{filter_type}"))
    result_list = []
    for item in result:
        result_list.append(format_result(item))
    return {"cards": result_list}


if __name__ == "__main__":
    app.run(debug=True)
