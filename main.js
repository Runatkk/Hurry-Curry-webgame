enchant();


// ここで自作クラスBearをつくる
Bear = Class.create(Sprite, // Spriteクラスを継承
    {
        initialize: function (x, y) { //初期化する
            Sprite.call(this, 32, 32); //Spriteオブジェクトを初期化
            this.image = game.assets['chara2.png'];
            this.x = x;
            this.y = y;

            this.tx = this.x; //行きたい場所のX座標
            this.ty = this.y; //行きたい場所のY座標
            this.frame = 1;
            game.rootScene.addChild(this);
        },
        //enterframeイベントのリスナーを定義する
        onenterframe: function () {
            slow = 30; //クマが行きたい場所へ近づく遅さ
            //行きたい場所へ近づく
            this.x += (this.tx - this.x) / slow;
            this.y += (this.ty - this.y) / slow;

        }
    });

// ここで自作クラスEnemyをつくる
Enemy = Class.create(Sprite, // Spriteクラスを継承
    {
        initialize: function (x, y) { //初期化する
            Sprite.call(this, 32, 32); //Spriteオブジェクトを初期化
            this.image = game.assets['chara2.png'];
            this.x = x;
            this.y = y;

            this.tx = this.x; //行きたい場所のX座標
            this.ty = this.y; //行きたい場所のY座標
            this.frame = 0;
            game.rootScene.addChild(this);
        },
        //enterframeイベントのリスナーを定義する
        onenterframe: function () {
            slow = 30; //クマが行きたい場所へ近づく遅さ
            //行きたい場所へ近づく

            this.x += (this.tx - this.x) / slow;
            this.y += (this.ty - this.y) / slow;

            if (this.within(bear)) {
                // game over
                if (Math.abs(this.x - bear.x) < 14 && Math.abs(this.y - bear.y) < 14) {
                    game.end(0, "Goal");
                }
            }

        }
    });


//フルーツのためのクラス
Fruits = Class.create(Sprite, // Spriteクラスを継承
    {
        initialize: function (frame) { //初期化する
            Sprite.call(this, 16, 16); //Spriteオブジェクトを初期化
            this.image = game.assets['icon1.png'];

            // ランダムな場所にフルーツを表示する
            this.x = Math.random() * 320; // Math.random()を使うと0から1未満の
            this.y = Math.random() * 320; // ランダムな小数が得られるのでそれで座標をつくる

            if (this.x > 304) this.x = 304;
            if (this.y > 304) this.y = 304;
            this.frame = frame;
            game.rootScene.addChild(this);
        },
        onenterframe: function () {
            if (this.within(bear)) {
                game.rootScene.removeChild(this);
                game.se.play(); //サウンドを鳴らす

                game.fruits_count--;

                game.score++; //スコアを1足す

                if (game.fruits_count <= 0) {
                    // 果物が全部食べられた
                    game.end(0, "Goal", game.assets['win.png']);
                }
                console.log(this.frame);
                switch (this.frame) {
                    case 1:
                        // burokori
                        game.time_count -= 1;
                        break;
                    case 2:
                        // fire
                        game.time_count += 3;
                        break;
                    case 4:
                        // potato
                        game.score += 3;
                        break;
                    case 0:
                        //ninjin
                        game.score += 1
                        break;
                    case 3:
                        //tamanegi
                        game.score += 2
                        break;
                    default:
                        break;
                }
                game.timeLabel.text = "TIME : " + game.time_count;
                game.scoreLabel.text = "SCORE : " + game.score;
            }
        }


    });


var Background = enchant.Class.create(enchant.Sprite, { //背景クラス
    initialize: function () {
        enchant.Sprite.call(this, 640, 320);
        this.image = game.assets['bg.png'];
        this.addEventListener('enterframe', function () {
            if (this.x-- <= -320) this.x = 0;
        });
        game.rootScene.addChild(this);
    }
});
window.onload = function () {
    game = new Game(320, 320);
    game.preload('chara2.png', 'icon1.png', 'bg.png');
    game.se = Sound.load("se8_1.wav"); //サウンドデータのダウンロード

    game.time_count = 30;
    game.clock = 0;
    game.clock2 = 0;
    game.score = 0;

    game.fruits_count = 50;
    game.onload = function () {
        background = new Background(); //背景を出現させる
        // スコアを表示するラベルを作成
        game.scoreLabel = new Label("SCORE : " + game.score);
        game.scoreLabel.font = "16px Tahoma";
        game.scoreLabel.color = "black";
        game.scoreLabel.x = 10; // X座標
        game.scoreLabel.y = 5; // Y座標
        game.rootScene.addChild(game.scoreLabel);

        // 時間を表示するラベルを作成
        game.timeLabel = new Label("TIME : " + game.time_count);
        game.timeLabel.font = "16px Tahoma";
        game.timeLabel.color = "black";
        game.timeLabel.x = 220; // X座標
        game.timeLabel.y = 5; // Y座標
        game.rootScene.addChild(game.timeLabel);



        bear = new Bear(150, 150); // くまをつくる
        enemy = new Enemy(0, 0); // 敵をつくる
        for (i = 0; i < 10; i++) {
            fruits = new Fruits(1); // 1番(burokori)を表示
        }
        for (i = 0; i < 10; i++) {
            fruits = new Fruits(2); // 2番(fire)を表示
        }
        for (i = 0; i < 10; i++) {
            fruits = new Fruits(4); // 4番(potato)を表示
        }
        for (i = 0; i < 10; i++) {
            fruits = new Fruits(0); // 0番(ninjin)を表示
        }
        for (i = 0; i < 10; i++) {
            fruits = new Fruits(3); // 3番(tamanegi)を表示
        }
        score = 0; //点数をリセット
        //ゲーム画面のどこかをタッチした時の処理
        game.rootScene.addEventListener('touchend', function (event) { //eventにタッチされた座標が入ってくる
            bear.tx = event.x; //クマの「行きたい場所」にタッチされたX座標を指定
            bear.ty = event.y; //クマの「行きたい場所」にタッチされたY座標を指定
        });

        if (!game.clock)
            game.clock = setInterval(function () {
                game.time_count--;
                if (game.time_count < 0) {
                    clearInterval(game.clock);
                    // game over
                    game.clock = 0;
                    game.end(0, "Goal");
                    return;
                }
                game.timeLabel.text = "TIME : " + game.time_count;
            }, 1000);

        if (!game.clock2)
            game.clock2 = setInterval(function () {
                if (game.time_count <= 0) {
                    clearInterval(game.clock2);
                    // game over
                    game.clock2 = 0;
                    return;
                }

                //target_x = bear.x + Math.round(Math.random() * 150) - 75;
                //target_y = bear.y + Math.round(Math.random() * 150) - 75;

                //target_x = (target_x > 320 || target_x < 0) ? bear.x : target_x;
                //target_y = (target_y > 320 || target_y < 0) ? bear.y : target_y;

                enemy.tx = bear.x;
                enemy.ty = bear.y;


            }, 100);


    }

    game.start();
}
