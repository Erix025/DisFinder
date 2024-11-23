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

if __name__ == '__main__':
    
    app.run(debug=True)
