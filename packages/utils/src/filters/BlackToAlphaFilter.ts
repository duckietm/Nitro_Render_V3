import { Filter, FilterSystem, GlProgram, RenderSurface, Texture } from 'pixi.js';

export class BlackToAlphaFilter extends Filter
{
    constructor()
    {
        const glProgram = GlProgram.from({
            vertex: `in vec2 aPosition;
            out vec2 vTextureCoord;

            uniform vec4 uInputSize;
            uniform vec4 uOutputFrame;
            uniform vec4 uOutputTexture;

            vec4 filterVertexPosition( void )
            {
                vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;

                position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
                position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

                return vec4(position, 0.0, 1.0);
            }

            vec2 filterTextureCoord( void )
            {
                return aPosition * (uOutputFrame.zw * uInputSize.zw);
            }

            void main(void)
            {
                gl_Position = filterVertexPosition();
                vTextureCoord = filterTextureCoord();
            }`,
            fragment: `
            in vec2 vTextureCoord;
            out vec4 finalColor;

            uniform sampler2D uTexture;

            void main(void) {
                vec4 color = texture(uTexture, vTextureCoord);
                float brightness = max(max(color.r, color.g), color.b);
                finalColor = vec4(color.rgb, color.a * brightness);
            }
            `,
            name: 'black-to-alpha-filter',
        });

        super({
            gpuProgram: null,
            glProgram,
            resources: {},
        });
    }

    public apply(
        filterManager: FilterSystem,
        input: Texture,
        output: RenderSurface,
        clearMode: boolean,
    ): void
    {
        filterManager.applyFilter(this, input, output, clearMode);
    }
}
