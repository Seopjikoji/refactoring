const invoice = require("./json/invoices.json")
const plays = require("./json/plays.json")


function statement(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances;
    return renderPlainText(statementData, plays);
}

function renderPlainText(data, plays){
    let result = `청구 내역 (고객명: ${data.customer})\n`

    for (let perf of data.performances) {

        result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)}\n`
    }

    result += `총액: ${usd(totalAmount())}\n`;
    result += `적립포인트: ${totalVolumeCredits()}점\n`;
    return result


    function totalAmount() {
        let result = 0;
        for (let perf of data.performances) {
            result += amountFor(perf);
        }
        return result;
    }

    function totalVolumeCredits() {
        let volumeCredits = 0;

        for (let perf of data.performances) {
            volumeCredits = volumeCreditsFor(perf);
        }
        return volumeCredits

    }

    function usd(aNumber) {
        return new Intl.NumberFormat("en-US",
            {
                style: "currency", currency: "USD",
                minimumFractionDigits: 2
            }).format(aNumber / 100);
    }

    function volumeCreditsFor(perf) {
        let result = 0;
        //포인트를 적립한다.
        result += Math.max(perf.audience - 30, 0);
        //희극 관객 5명마다 추가 포인트를 제공한다.
        if ("comedy" === playFor(perf).type)
            result += Math.floor(perf.audience / 5);
        return result
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

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
}

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


console.log(statement(invoice[0], plays))
