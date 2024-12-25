from bs4 import BeautifulSoup
import http.client
import urllib.parse

def fetch_page(url: str):
    # 解析 URL
    parsed_url = urllib.parse.urlparse(url)

    # 提取主机名和路径
    host = parsed_url.hostname
    path = parsed_url.path + '?' + parsed_url.query

    # 创建 HTTPS 连接
    conn = http.client.HTTPSConnection(host)

    # 发送 GET 请求
    conn.request("GET", path)

    # 获取响应
    response = conn.getresponse()
    print(response.status, response.reason)

    # 读取响应内容
    html = response.read().decode('utf-8')

    # 关闭连接
    conn.close()    
    return html

def get_soup(html: str):
    return BeautifulSoup(html, 'html.parser')