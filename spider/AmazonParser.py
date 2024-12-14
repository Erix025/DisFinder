from ParserBase import ParserBase
import utils


class AmazonParser(ParserBase):
    def __init__(self, driver):
        super().__init__()
        self.driver = driver if driver else utils.start_driver()
        self.base_url = 'https://www.amazon.com'
        self.search_url = 'https://www.amazon.com/s?k='
    
    def get_result_list(self, html: str) -> list:
        soup = utils.get_soup(html)
        return soup.find_all('div', {'data-component-type': 's-search-result'})
    
    def parse_result(self, result) -> dict:
        title_element = result.find('div', {'data-cy': "title-recipe"})
        if title_element:
            title_element = title_element.find('a')
        else:
            return None
        img_element = result.find('img')
        price_element_whole = result.find('span', {'class': 'a-price-whole'})
        price_element_fraction = result.find('span', {'class': 'a-price-fraction'})
        
        purl = self.base_url + title_element['href']
        title = title_element.find('span').text.strip()
        img_url = img_element['src']
        if price_element_whole and price_element_fraction:
            price = price_element_whole.text + price_element_fraction.text
        elif price_element_whole:
            price = price_element_whole.text
        else:
            price = 'N/A'
        
        # skip useless result
        if title == "Sponsored":
            return
        if price == 'N/A':
            return
        
        return {
            "title": title,
            "price": price,
            "url": purl,
            "img": img_url,
            "platform": 0
        }
        
    def parse_results(self, html):
        super().parse_results(html)
        
    def search(self, keyword) -> list:
        url = self.search_url + keyword
        print(keyword)
        print(url)
        html = utils.fetch_page(self.driver, url)
        # save html
        with open("amazon.html", "w") as f:
            f.write(str(html))
        result_list = self.get_result_list(html)
        # print(result_list)
        res_list = [self.parse_result(result) for result in result_list]
        res_list = [res for res in res_list if res]
        return res_list