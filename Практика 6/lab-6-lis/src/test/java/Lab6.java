import com.codeborne.selenide.ClickOptions;
import com.codeborne.selenide.Condition;
import org.junit.Test;

import static com.codeborne.selenide.Selectors.byText;
import static com.codeborne.selenide.Selenide.*;

public class Lab6 {

    @Test
    public void FirstTestGoogle(){
        clearBrowserCookies();

        open("https://www.google.ru/");
        $x("//textarea[@name='q']").setValue("Моисей").pressEnter();
        sleep(10000);
        $x("//div[@id='result-stats']").shouldBe(Condition.visible);

    }
}
