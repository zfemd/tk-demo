import assign from 'object-assign'
import Url from 'url'
import querystring from 'querystring'

var data1 = [
    {id: 1, name: 'n1', img: 'http://gd2.alicdn.com/imgextra/i3/TB1vuUkNVXXXXbkaVXXXXXXXXXX_!!0-item_pic.jpg_310x310q90.jpg'},
    {id: 2, name: 'n2', img: 'http://gd2.alicdn.com/imgextra/i4/2329290764/TB2oaIzX0RopuFjSZFtXXcanpXa_!!2329290764.jpg_310x310q90.jpg'},
    {id: 3, name: 'n3', img: 'http://gd2.alicdn.com/imgextra/i3/TB1vuUkNVXXXXbkaVXXXXXXXXXX_!!0-item_pic.jpg_310x310q90.jpg'},
    {id: 4, name: 'n4', img: 'http://gd2.alicdn.com/imgextra/i4/2329290764/TB2oaIzX0RopuFjSZFtXXcanpXa_!!2329290764.jpg_310x310q90.jpg'},
    {id: 5, name: 'n5', img: 'http://gd2.alicdn.com/imgextra/i3/TB1vuUkNVXXXXbkaVXXXXXXXXXX_!!0-item_pic.jpg_310x310q90.jpg'},
    {id: 6, name: 'n6', img: 'http://gd2.alicdn.com/imgextra/i4/2329290764/TB2oaIzX0RopuFjSZFtXXcanpXa_!!2329290764.jpg_310x310q90.jpg'},
    {id: 7, name: 'n7', img: 'http://gd2.alicdn.com/imgextra/i3/TB1vuUkNVXXXXbkaVXXXXXXXXXX_!!0-item_pic.jpg_310x310q90.jpg'},
    {id: 8, name: 'n8', img: 'http://gd2.alicdn.com/imgextra/i4/2329290764/TB2oaIzX0RopuFjSZFtXXcanpXa_!!2329290764.jpg_310x310q90.jpg'},
    {id: 9, name: 'n9', img: 'http://gd2.alicdn.com/imgextra/i3/TB1vuUkNVXXXXbkaVXXXXXXXXXX_!!0-item_pic.jpg_310x310q90.jpg'},
    {id: 10, name: 'n10', img: 'http://gd2.alicdn.com/imgextra/i4/2329290764/TB2oaIzX0RopuFjSZFtXXcanpXa_!!2329290764.jpg_310x310q90.jpg'}
];

var data2 = [
    {id: 11, name: 'n11', img: 'http://gd2.alicdn.com/imgextra/i3/TB11i7kOpXXXXX_XXXXXXXXXXXX_!!0-item_pic.jpg_310x310q90.jpg'},
    {id: 12, name: 'n12', img: 'http://gd2.alicdn.com/imgextra/i2/2403254117/TB2nMZHcByN.eBjSZFIXXXbUVXa_!!2403254117.jpg_310x310q90.jpg'},
    {id: 13, name: 'n13', img: 'http://gd2.alicdn.com/imgextra/i3/TB11i7kOpXXXXX_XXXXXXXXXXXX_!!0-item_pic.jpg_310x310q90.jpg'},
    {id: 14, name: 'n14', img: 'http://gd2.alicdn.com/imgextra/i2/2403254117/TB2nMZHcByN.eBjSZFIXXXbUVXa_!!2403254117.jpg_310x310q90.jpg'},
    {id: 15, name: 'n15', img: 'http://gd2.alicdn.com/imgextra/i3/TB11i7kOpXXXXX_XXXXXXXXXXXX_!!0-item_pic.jpg_310x310q90.jpg'},
    {id: 16, name: 'n16', img: 'http://gd2.alicdn.com/imgextra/i2/2403254117/TB2nMZHcByN.eBjSZFIXXXbUVXa_!!2403254117.jpg_310x310q90.jpg'},
    {id: 17, name: 'n17', img: 'http://gd2.alicdn.com/imgextra/i3/TB11i7kOpXXXXX_XXXXXXXXXXXX_!!0-item_pic.jpg_310x310q90.jpg'},
    {id: 18, name: 'n18', img: 'http://gd2.alicdn.com/imgextra/i2/2403254117/TB2nMZHcByN.eBjSZFIXXXbUVXa_!!2403254117.jpg_310x310q90.jpg'},
    {id: 19, name: 'n19', img: 'http://gd2.alicdn.com/imgextra/i3/TB11i7kOpXXXXX_XXXXXXXXXXXX_!!0-item_pic.jpg_310x310q90.jpg'},
    {id: 20, name: 'n20', img: 'http://gd2.alicdn.com/imgextra/i2/2403254117/TB2nMZHcByN.eBjSZFIXXXbUVXa_!!2403254117.jpg_310x310q90.jpg'}
];

function fetchPromise(url, opt) {
   const request = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  
  merge = assign({}, request, opt)

  return new Promise((resolve, reject) => {
    if (url.indexOf("test-test") != -1) {
      console.log('test-test')
      const paserResult = querystring.parse(Url.parse(url).query)
    
      var pageNum = paserResult.pageNum || 0;
      var pageSize = paserResult.pageSize || 10;
      if (pageNum == 0) {
          resolve({
              res: {
                  dataList: data1
              }
          });
      } else if(pageNum == 1) {
          resolve({
              res: {
                  dataList: data2
              }
          });
      } else {
          resolve({
              res: {
                  dataList: []
              }
          })
      }
    }
    
    fetch(url, merge)
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(err => resolve(err)) 
  })
}

export default fetchPromise