from AmazonParser import AmazonParser
from EBayParser import EBayParser
import utils

# html = utils.fetch_page("https://www.ebay.com/sch/i.html?_nkw=iphone+15")
# with open("ebay.html", "w") as f:
#     f.write(html)

parser = EBayParser()

list = parser.search('iphone+15')
print(list)