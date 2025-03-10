package mrthomas20121.tfc_decoration.block;

import mrthomas20121.tfc_decoration.TFCDecoration;
import mrthomas20121.tfc_decoration.item.TFCDecItems;
import net.dries007.tfc.common.TFCItemGroup;
import net.dries007.tfc.common.blocks.rock.Rock;
import net.dries007.tfc.util.Helpers;
import net.minecraft.world.item.BlockItem;
import net.minecraft.world.item.Item;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.RotatedPillarBlock;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraft.world.level.material.Material;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

import javax.annotation.Nullable;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.function.Supplier;

public class TFCDecBlocks {

    public static final DeferredRegister<Block> BLOCKS = DeferredRegister.create(ForgeRegistries.BLOCKS, TFCDecoration.mod_id);

    public static final Map<Rock, RegistryObject<RotatedPillarBlock>> PILLARS = Helpers.mapOfKeys(Rock.class, rock -> register("pillar/" + rock.name(), () -> new RotatedPillarBlock(BlockBehaviour.Properties.of(Material.STONE).strength(0.5f))));
    public static final Map<Rock, RegistryObject<Block>> ROCKWOOL = Helpers.mapOfKeys(Rock.class, rock -> register("rockwool/" + rock.name(), () -> new Block(BlockBehaviour.Properties.of(Material.STONE).strength(0.4f))));

    public static RegistryObject<Block> POLISHED_FIRE_CLAY = register("polished_fire_clay", 0.3f);

    private static RegistryObject<Block> register(String name, float strength)
    {
        return register(name, () -> new Block(BlockBehaviour.Properties.of(Material.STONE).strength(strength)), block -> new BlockItem(block, new Item.Properties().tab(TFCItemGroup.DECORATIONS)));
    }

    private static <T extends Block> RegistryObject<T> register(String name, Supplier<T> blockSupplier)
    {
        return register(name, blockSupplier, block -> new BlockItem(block, new Item.Properties().tab(TFCItemGroup.DECORATIONS)));
    }

    private static <T extends Block> RegistryObject<T> register(String name, Supplier<T> blockSupplier, Item.Properties blockItemProperties)
    {
        return register(name, blockSupplier, block -> new BlockItem(block, blockItemProperties));
    }

    private static <T extends Block> RegistryObject<T> register(String name, Supplier<T> blockSupplier, @Nullable Function<T, ? extends BlockItem> blockItemFactory)
    {
        final String actualName = name.toLowerCase(Locale.ROOT);
        final RegistryObject<T> block = BLOCKS.register(actualName, blockSupplier);
        if (blockItemFactory != null)
        {
            TFCDecItems.ITEMS.register(actualName, () -> blockItemFactory.apply(block.get()));
        }
        return block;
    }
}
