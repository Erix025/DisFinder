from ParserBase import ParserBase
import utils
import re


class EBayParser(ParserBase):
    def __init__(self, driver):
        super().__init__()
        self.driver = driver if driver else utils.start_driver()
        self.base_url = 'https://www.ebay.com'
        self.search_url = 'https://www.ebay.com/sch/i.html?_nkw='
    
    def get_result_list(self, html: str) -> list:
        soup = utils.get_soup(html)
        return soup.find('ul', {'class': 'srp-results srp-list clearfix'}).find_all('li')
    
    def parse_result(self, result) -> dict:
        title_element = result.find('div', {'class': "s-item__title"})
        if title_element:
            title_element = title_element.find('span')
        else:
            return None
        img_element = result.find('img')
        price_element = result.find('span', {'class': 's-item__price'})
        url_element = result.find('a', {'class': 's-item__link'})
                
        purl = url_element['href']
        title = title_element.text.strip()
        img_url = img_element['src']
        if price_element:
            price = price_element.text
        else:
            price = 'N/A'
        
        # if price is a range, skip
        if '~' in price:
            return
        if '至' in price:
            return
        
        # cut of the currency symbol
        price = price.replace('$', '')
        price = price.replace('元', '')
        price = price.replace(',', '')
        
        try:
            price = float(price)
        except ValueError:
            price = 'N/A'
            
        if price == 'N/A':
            return
        
        return {
            "title": title,
            "price": price,
            "url": purl,
            "image": img_url,
            "platform": 2
        }
        
    def parse_results(self, html):
        super().parse_results(html)
        
    def search(self, keyword) -> list:
        url = self.search_url + keyword
        html = utils.fetch_page(self.driver, url)
        # save html
        # with open("ebay.html", "w") as f:
        #     f.write(str(html))
        result_list = self.get_result_list(html)
        res_list = [self.parse_result(result) for result in result_list]
        res_list = [res for res in res_list if res]
        return res_list
    
    def extract_price(self, price_str):
        match = re.search(r'\d+(\.\d+)?', price_str)
        if match:
            return float(match.group())
        else:
            return 'N/A'
    
    def poll(self, url) -> dict:
        price = 0
        html = utils.fetch_page(self.driver, url)
        soup = utils.get_soup(html)
        price_element = soup.find('div', {'class': 'x-price-primary'})
        if price_element:
            price_element = price_element.find('span')
            
        if price_element:
            price = price_element.text
            price = self.extract_price(price)
        else:
            price = 'N/A'
            
        if price == 'N/A':
            return -1
        return price