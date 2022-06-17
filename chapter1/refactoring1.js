function statement(invoice) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `청구 내역 (고객명: ${invoice.customer})\n`
    const format = new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format;


    for (let perf of invoice.performances) {

        // const play = playFor(perf);
        // const play = plays[perf.playID]

        // let thisAmount = amountFor(perf);

      volumeCredits = volumeCreditsFor(perf);

        //청구 내역을 출력한다.
        result += ` ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience}석)}\n`
        totalAmount += amountFor(perf);
    }

    result += `총액: ${format(totalAmount / 100)}\n`;
    result += `적립포인트: ${volumeCredits}점\n`;
    return result

}
const invoice = require("./json/invoices.json")
const plays = require("./json/plays.json")

// statement(invoice[0], plays)


function amountFor(aPerformance) {

    //변수 변경
    let result = 0;

    switch (playFor(aPerformance).type) {
        case "tragedy": //비극
            result = 40000;
            if (aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }
            break;

        case "comedy": //희극
            result = 30000;
            if (aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20);
            }
            result += 300 * aPerformance.audience - 20;
            break;

        default:
            throw new Error(`알 수 없느 장르: ${playFor(aPerformance).type}`)
    }

    return result

}

function playFor(aPerformance){
    return plays[aPerformance.playID];
}

console.log(statement(invoice[0], plays))

function volumeCreditsFor(perf){
    let volumeCredits = 0;
      //포인트를 적립한다.
      volumeCredits += Math.max(perf.audience - 30, 0);
      //희극 관객 5명마다 추가 포인트를 제공한다.
      if ("comedy" === playFor(perf).type) 
      volumeCredits += Math.floor(perf.audience / 5);
      return volumeCredits
}