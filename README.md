# nextjs-curriculum

## Demo
https://nextjs-curriculum.vercel.app/curriculum

- Bonus
https://nextjs-curriculum.vercel.app/curriculum/bonus

## 題目

請用純 Next 寫一個頁面，若要用 UI Library 可用 Material UI 或搭配 Tailwind CSS，不可使用其他套件。
請刻出一個時間篩選器，使用者可以透過拖拉的方式一次選取或取消選取多個時間格，請用不同顏色代表已選取、正在被選取、正在取消選取的時間格。
時間格大小為寬 6 長 15 (同學校上課時間)，在上側標記中文星期，左側標記上課時間代號。參考圖片：https://imgur.com/6vQ8wYT.png

- path: `{host}/curriculum`
- 參考資料：
  1. https://github.com/mcjohnalds/react-table-drag-select
  2. ChatGPT
  3. 其他網路資源
- 補充：

  1. 外觀沒有設別設定，因為感覺這是著重功能面的作業
  2. 同上， css 直接放在 global css 沒有特別處理（.module.css 之類）
  3. 正在選取時方匡為綠色、已選取的方匡深灰色、尚未選曲淺灰色
  4. 選取後的資料有顯示在頁面上，也有放在 url query 裏面。因為不知道資料後續的處理與需求，所以沒有特別整理，單純印出`{row, col}`的 index.
  5. `TableDragSelect.tsx` 有用到一行 lodash 的 deepClone. 這樣確實違反不要使用其他套件的需求，但我覺得程式碼這樣寫比較簡潔。
     同時附上 deepClone 的 implement：

  ```
  function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        // If the obj is null or not an object, return the obj itself
        return obj;
    }

    if (Array.isArray(obj)) {
        // If obj is an array, create a new array and clone each element
        const newArray = [];
        for (let i = 0; i < obj.length; i++) {
        newArray[i] = deepClone(obj[i]);
        }
        return newArray;
    }

    // If obj is an object, create a new object and clone each property
    const newObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
        newObj[key] = deepClone(obj[key]);
        }
    }
    return newObj;
  }
  ```

  直接搜尋 'js deepClone implement' 也可以找到很多資料。

## Bonus

- [v] 在手機上也可以正常拖拉

- [v] 當外層有一個長度比篩選器小的容器時，拖拉時間格時若接近容器邊框，篩選器應該慢慢滑動讓使用者可以繼續選取。
  - path: `{host}/curriculum/bonus`
- [v] 同步已選取的時間到網址中，以逗號分開

## Simple QA

### Is { ...object } deep cloning?

不是，直接在 console 做個小實驗就知道了。

Experience1

```
a = {name: "bob"}
b = {...a}
> {name: 'bob'}
b.name = "alice"
> 'alice'
a
> {name: 'bob'}
```

Experience2

```
a = {name: {en: "bob"}}
b = {...a}
b
> {name: {…}}name: {en: 'bob'}[[Prototype]]: Object
b.name.en = 'alice'
a
> {name: {…}}name: {en: 'alice'}[[Prototype]]: Object
```

由此可見，在經過一次 Spread Operators 後，如果得到的東西還是 object 他會 copy reference.

### Is useMemo always good? Why?

當然不一定比較好，當某個元件頻繁渲染及元件內計算代價高時 useMemo 才能發揮作用。
反之，如果元件本身不常重新渲染或是計算很簡單，使用 useMemo 去記憶反而可能效能更差。

此外，useMemo 也有一定的使用門檻，除了可能影響程式可讀性。
如果不正確使用，也有可能在需要重新計算或渲染的情況下，出現沒有重新計算的錯誤。
