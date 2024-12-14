from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import http.client
import urllib.parse

def start_driver():
    # 配置 Chrome 无头模式
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # 启用无头模式
    chrome_options.add_argument("--disable-gpu")  # 禁用 GPU 加速，适用于一些环境

    # 启动 Chrome 浏览器
    driver = webdriver.Chrome(options=chrome_options)
    return driver

def close_driver(driver):
    driver.quit()

def fetch_page(driver, url: str):
    # driver.get(url)
    # html = driver.page_source
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
    # print(html.decode('utf-8'))

    # 关闭连接
    conn.close()    
    return html

def get_soup(html: str):
    return BeautifulSoup(html, 'html.parser')