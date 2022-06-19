const invoice = require("./json/invoices.json")
const plays = require("./json/plays.json")


class PerformanceCalculator {
    constructor(aPerformance, aPlay) {
        this.performances = aPerformance;
        this.play = aPlay;
    }

    get amount() {

        //변수 변경
        let result = 0;

        switch (this.play.type) {
            case "tragedy": //비극
                result = 40000;
                if (this.performances.audience > 30) {
                    result += 1000 * (this.performances.audience - 30);
                }
                break;

            case "comedy": //희극
                result = 30000;
                if (this.performances.audience > 20) {
                    result += 10000 + 500 * (this.performances.audience - 20);
                }
                result += 300 * this.performances.audience - 20;
                break;

            default:
                throw new Error(`알 수 없느 장르: ${this.play.type}`)
        }

        return result

    }
}


function htmlStatement(invoice, plays) {
    return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data) {
    let result = `<h1>청구 내역 (고객명: ${data.customer}</h1>\n)`;
    result += "<table>\n";
    result += "<tr><th>연극</th><th>좌석 수</th><th>금액</th></th>";

    for (let perf of data.performances) {
        result += `<tr><td>${perf.play.name}</td><td>${perf.audience}석</td>`
        result += `<td>${usd(perf.amount)}</td></tr>\n`
    }

    result += "</table>\n";
    result += `<p>총액: <em>${usd(data.totalAmount)}</em></p>\n`;
    result += `<p>적립포인트: <em>${data.volumeCredits}</em>점</p>\n`;

    return result



}

function usd(aNumber) {
    return new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format(aNumber / 100);
}

function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;

    function enrichPerformance(aPerformance) {
        const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance));

        const result = Object.assign({}, aPerformance)
        result.play = calculator.play;
        result.amount = calculator.amount;
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function amountFor(aPerformance) {
        return new PerformanceCalculator(aPerformance, playFor(aPerformance)).amount;
    //     //변수 변경
    //     let result = 0;

    //     switch (aPerformance.play.type) {
    //         case "tragedy": //비극
    //             result = 40000;
    //             if (aPerformance.audience > 30) {
    //                 result += 1000 * (aPerformance.audience - 30);
    //             }
    //             break;

    //         case "comedy": //희극
    //             result = 30000;
    //             if (aPerformance.audience > 20) {
    //                 result += 10000 + 500 * (aPerformance.audience - 20);
    //             }
    //             result += 300 * aPerformance.audience - 20;
    //             break;

    //         default:
    //             throw new Error(`알 수 없느 장르: ${aPerformance.play.type}`)
    //     }

    //     return result

    }

    function volumeCreditsFor(aPerformance) {
        let result = 0;
        //포인트를 적립한다.
        result += Math.max(aPerformance.audience - 30, 0);
        //희극 관객 5명마다 추가 포인트를 제공한다.
        if ("comedy" === aPerformance.play.type)
            result += Math.floor(aPerformance.audience / 5);
        return result
    }

    function totalAmount(data) {
        return data.performances
            .reduce((total, p) => total + p.amount, 0)
    }

    function totalVolumeCredits(data) {
        return data.performances
            .reduce((total, p) => total + p.volumeCredits, 0)

    }
}

console.log(htmlStatement(invoice[0], plays))



// function renderPlainText(data, plays) {
//     let result = `청구 내역 (고객명: ${data.customer})\n`

//     for (let perf of data.performances) {

//         result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)}\n`
//     }

//     result += `총액: ${data.totalAmount}\n`;
//     result += `적립포인트: ${data.totalVolumeCredits}점\n`;
//     return result

// }




// function statement(invoice, plays) {
//     let result = `청구 내역 (고객명: ${invoice.customer})\n`

//     for (let perf of invoice.performances) {

//         result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)}\n`
//     }

//     result += `총액: ${usd(totalAmount())}\n`;
//     result += `적립포인트: ${totalVolumeCredits()}점\n`;
//     return result


//     function totalAmount() {
//         let result = 0;
//         for (let perf of invoice.performances) {
//             result += amountFor(perf);
//         }
//         return result;
//     }

//     function totalVolumeCredits() {
//         let volumeCredits = 0;

//         for (let perf of invoice.performances) {
//             volumeCredits = volumeCreditsFor(perf);
//         }
//         return volumeCredits

//     }

//     function usd(aNumber) {
//         return new Intl.NumberFormat("en-US",
//             {
//                 style: "currency", currency: "USD",
//                 minimumFractionDigits: 2
//             }).format(aNumber / 100);
//     }

//     function volumeCreditsFor(perf) {
//         let result = 0;
//         //포인트를 적립한다.
//         result += Math.max(perf.audience - 30, 0);
//         //희극 관객 5명마다 추가 포인트를 제공한다.
//         if ("comedy" === playFor(perf).type)
//             result += Math.floor(perf.audience / 5);
//         return result
//     }

//     function playFor(aPerformance) {
//         return plays[aPerformance.playID];
//     }

//     function amountFor(aPerformance) {

//         //변수 변경
//         let result = 0;

//         switch (playFor(aPerformance).type) {
//             case "tragedy": //비극
//                 result = 40000;
//                 if (aPerformance.audience > 30) {
//                     result += 1000 * (aPerformance.audience - 30);
//                 }
//                 break;

//             case "comedy": //희극
//                 result = 30000;
//                 if (aPerformance.audience > 20) {
//                     result += 10000 + 500 * (aPerformance.audience - 20);
//                 }
//                 result += 300 * aPerformance.audience - 20;
//                 break;

//             default:
//                 throw new Error(`알 수 없느 장르: ${playFor(aPerformance).type}`)
//         }

//         return result

//     }


// }

