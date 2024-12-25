class ParserBase:
    def __init__(self):
        pass

    def parse_results(self, html):
        result_list = self.get_result_list(html)
        return [self.parse_result(result) for result in result_list]
    
    def get_result_list(self, html: str) -> list:
        raise NotImplementedError
    
    def parse_result(self, result) -> dict:
        raise NotImplementedError