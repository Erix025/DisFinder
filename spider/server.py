from flask import Flask, request, jsonify
from AmazonParser import AmazonParser
from EBayParser import EBayParser
import utils

app = Flask(__name__)
driver = utils.start_driver()

class SearchResponse:
    def __init__(self, code, msg, products):
        self.code = code
        self.msg = msg
        self.data = products

    def to_dict(self):
        return {
            'code': self.code,
            'msg': self.msg,
            'data': self.data
        }

class PollResponse:
    def __init__(self, code, msg, price):
        self.code = code
        self.msg = msg
        self.data = price if price else None
        
    def to_dict(self):
        return {
            'code': self.code,
            'msg': self.msg,
            'data': self.data
        }

def search_handler(driver, keyword: str) -> SearchResponse:
    results = []
    keyword = keyword.replace(' ', '+')
    # search for amazon
    amazon_parser = AmazonParser(driver)
    amazon_results = amazon_parser.search(keyword)
    results.extend(amazon_results)
    # search for ebay
    ebay_parser = EBayParser(driver)
    ebay_results = ebay_parser.search(keyword)
    results.extend(ebay_results)
    return SearchResponse(200, 'Success', results)

@app.route('/spider/search', methods=['GET'])
def spider_search():
    # 获取请求数据
    keyword = request.args.get('keyword')
    if not keyword:
        return jsonify(SearchResponse(400, 'Keyword is required', []).to_dict())

    # 返回搜索结果
    return jsonify(search_handler(driver, keyword).to_dict())

def poll_handler(driver, url):
    if 'amazon' in url:
        parser = AmazonParser(driver)
        price = parser.poll(url)
        if price < 0:
            return PollResponse(400, 'Failed', -1)
        return PollResponse(200, 'Success', price)
    elif 'ebay' in url:
        parser = EBayParser(driver)
        price = parser.poll(url)
        if price < 0:
            return PollResponse(400, 'Failed', None)
        return PollResponse(200, 'Success', price)
    else:
        return PollResponse(400, 'Bad request', None)

@app.route('/spider/poll', methods=['POST'])
def spider_poll():
    url = request.json.get('url')
    if not url:
        return jsonify(SearchResponse(400, 'Bad request', []).to_dict())
    
    return jsonify(poll_handler(driver, url).to_dict())


if __name__ == '__main__':
    
    app.run(debug=True, port=8888)
