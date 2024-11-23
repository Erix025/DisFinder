from ParserBase import ParserBase
import utils


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
        
        return {
            "title": title,
            "price": price,
            "url": purl,
            "img": img_url,
            "platform": "EBay"
        }
        
    def parse_results(self, html):
        super().parse_results(html)
        
    def search(self, keyword) -> list:
        url = self.search_url + keyword
        html = utils.fetch_page(self.driver, url)
        result_list = self.get_result_list(html)
        res_list = [self.parse_result(result) for result in result_list]
        res_list = [res for res in res_list if res]
        return res_list