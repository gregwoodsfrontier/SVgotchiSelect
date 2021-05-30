<<<<<<< HEAD
import Phaser from 'phaser'

function blinkText(_scene: Phaser.Scene, _text: Phaser.GameObjects.Text, blinkDelay: number)
{
    if (_text.visible === true)
    {
        _scene.time.delayedCall(blinkDelay, () =>
        {
            _text.setVisible(false);
        }) 
    }
    else
    {
        _scene.time.delayedCall(blinkDelay, () =>
        {
            _text.setVisible(true);
        })
    }
}

=======
import Phaser from 'phaser'

function blinkText(_scene: Phaser.Scene, _text: Phaser.GameObjects.Text, blinkDelay: number)
{
    if (_text.visible === true)
    {
        _scene.time.delayedCall(blinkDelay, () =>
        {
            _text.setVisible(false);
        }) 
    }
    else
    {
        _scene.time.delayedCall(blinkDelay, () =>
        {
            _text.setVisible(true);
        })
    }
}

>>>>>>> 3ca44af62bf37991318ca8070c49541097633a71
export default blinkText