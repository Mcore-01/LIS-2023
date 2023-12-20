import com.codeborne.selenide.Condition;
import org.junit.Test;

import static com.codeborne.selenide.Selectors.byText;
import static com.codeborne.selenide.Selenide.*;

public class Lab7 {

    @Test
    public void FirstTestGoogle(){
        clearBrowserCookies();

        open("https://www.google.ru/");
        $x("//textarea[@name='q']").setValue("Моисей").pressEnter();
        sleep(10000);
        $x("//div[@id='result-stats']").shouldBe(Condition.visible);

    }

    String yandex = "https://market.yandex.ru/";
    @Test
    public void PoiskTovaraSortiravkaOtkritieTovara(){
        clearBrowserCookies();
        open(yandex);
        $x("//input[@name='text']").setValue("игровой монитор 30 герц").pressEnter();
        sleep(5000);
        $x("//button[@class='_23p69 _3D8AA cia-vs cia-cs']").doubleClick();
        sleep(5000);
        $x("//span[@class='_1E10J _2o124 _1zh3_']").click();
        sleep(10000);
    }
    @Test
    public void PoiskViborTsvetaTovaraSortiravka(){
        clearBrowserCookies();
        open(yandex);
        $x("//input[@name='text']").setValue("игровой коврик для мыши").pressEnter();
        sleep(5000);
        $x("//span[@class=\"_3JAFa\"]").scrollIntoView(false).click();
        sleep(5000);
        $x("//button[@class='_23p69 _3D8AA cia-vs cia-cs']").scrollIntoView(false).click();
        sleep(10000);
    }
    @Test
    public void PoiskTovaraSortiravkaLogitech(){
        clearBrowserCookies();
        open(yandex);
        $x("//input[@name='text']").setValue("игровая мышь").pressEnter();
        sleep(5000);
        $x("//button[@class=\"_23p69 _3D8AA cia-vs cia-cs\"]").doubleClick();
        sleep(5000);
        $x("//div[@data-filter-value-id=\"444293\"]").scrollIntoView(false).click();
        sleep(5000);
        $x("//span[@class=\"_1E10J _2o124 _3VXOR\"]").scrollIntoView(false).click();
        sleep(5000);
    }
    @Test
    public void PoiskTovaraSortiravkaNaushniki(){
        clearBrowserCookies();
        open(yandex);
        $x("//input[@name='text']").setValue("наушники").pressEnter();
        sleep(5000);
        $x("//button[@data-autotest-id=\"rating\"]").click();
        sleep(5000);
        $x("//div[@data-filter-value-id=\"discount\"]").scrollIntoView(false).click();
        sleep(5000);
        $x("//div[@data-filter-value-id=\"offer-shipping_store\"]").scrollIntoView(false).click();
        sleep(5000);
    }
    @Test
    public void PoiskTovaraSortiravkaIOtkritieClavishIDobavlenieVKorzinu(){
        clearBrowserCookies();
        open(yandex);
        $x("//input[@name='text']").setValue("клавиатура").pressEnter();
        sleep(5000);
        $x("//div[@data-filter-value-id=\"36777993\"]").scrollIntoView(false).click();
        sleep(3000);
        $x("//button[@data-autotest-id=\"rating\" or @data-autotest-id=\"ropr\"]").click();
        sleep(6000);
        $x("//article[@data-autotest-id=\"product-snippet\"]").scrollIntoView(false).click();
        sleep(5000);
        $x("//div[@data-zone-name=\"cartButton\"]").click();
        sleep(15000);
    }

    @Test
    public void PoiskTovaraSortiravkaIOtkritieClavishIDobavlenieVKorzinuPosleUdalenie(){
        clearBrowserCookies();
        open(yandex);
        $x("//input[@name='text']").setValue("клавиатура logitech").pressEnter();
        sleep(2000);
        $x("//div[@data-filter-value-id=\"36777993\"]").scrollIntoView(false).click();
        sleep(2000);
        $x("//button[@data-autotest-id=\"rating\" or @data-autotest-id=\"rorp\"]").click();
        sleep(2000);
        $x("//article[@data-autotest-id=\"product-snippet\"]").scrollIntoView(false).click();
        sleep(2000);
        $x("//div[@data-zone-name=\"cartButton\"]").click();
        sleep(5000);
        $x("//button[@data-auto=\"close-popup\" or aria-label=\"Закрыть\"]").click();
        sleep(5000);
        $x("//button[@data-autotest-id=\"decrease\" or @data-auto=\"decrease\" or @aria-label=\"Уменьшить\"]").click();
        sleep(15000);
    }

    @Test
    public void PoiskTovaraSortiravkaIOtkritieClavishIDobavlenieVKorzinuPosleDobavlenie(){
        clearBrowserCookies();
        open(yandex);
        $x("//input[@name='text']").setValue("клавиатура logitech").pressEnter();
        sleep(2000);
        $x("//div[@data-filter-value-id=\"36777993\"]").scrollIntoView(false).click();
        sleep(2000);
        $x("//button[@data-autotest-id=\"rating\" or @data-autotest-id=\"rorp\"]").click();
        sleep(2000);
        $x("//article[@data-autotest-id=\"product-snippet\"]").scrollIntoView(false).click();
        sleep(2000);
        $x("//div[@data-zone-name=\"cartButton\"]").click();
        sleep(5000);
        $x("//button[@data-auto=\"close-popup\" or aria-label=\"Закрыть\"]").click();
        sleep(5000);
        $x("//button[@data-autotest-id=\"increase\" or @data-auto=\"increase\" or @aria-label=\"Увеличить\"]").click();
        sleep(15000);
    }

    //Поиск телефона по категории
    @Test
    public void CategorySearch(){
        clearBrowserCookies();
        open(yandex);
        sleep(2000);
        $x("//div[@data-zone-name=\"catalog\"]").click();
        sleep(2000);
        $(byText("Смартфоны")).click();
        sleep(2000);
        $(byText("128 ГБ")).scrollIntoView(false).click();
        sleep(2000);
        $(byText("Новый")).scrollIntoView(false).click();
        sleep(2000);
        $(byText("120 Гц")).scrollIntoView(false).click();
        sleep(2000);
        $(byText("по рейтингу")).scrollIntoView(false).click();
        sleep(2000);
        $x("//span[@class=\"_1E10J _2o124 _1zh3_\" or class=\"_1E10J _2o124 _1zh3_\"]").scrollIntoView(false).click();
        sleep(6000);
    }

}
